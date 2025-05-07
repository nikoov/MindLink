import pytest
from app import app, analyzer
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert json.loads(response.data) == {'status': 'healthy'}

def test_sentiment_analysis():
    # Test positive sentiment
    positive_score = analyzer.polarity_scores("I feel much better today")['compound']
    assert positive_score > 0.2

    # Test negative sentiment
    negative_score = analyzer.polarity_scores("I'm feeling very anxious")['compound']
    assert negative_score < -0.2

    # Test neutral sentiment
    neutral_score = analyzer.polarity_scores("I'm here for therapy")['compound']
    assert -0.1 <= neutral_score <= 0.1

def test_get_response_endpoint(client):
    test_input = {
        "text": "I've been feeling anxious lately",
        "session_type": "initial"
    }
    
    response = client.post('/get_response',
                          data=json.dumps(test_input),
                          content_type='application/json')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'reply' in data
    assert 'sentiment' in data
    assert isinstance(data['sentiment'], float)
    assert -1 <= data['sentiment'] <= 1

def test_error_handling(client):
    # Test with invalid JSON
    response = client.post('/get_response',
                          data='invalid json',
                          content_type='application/json')
    assert response.status_code == 400

    # Test with missing required field
    response = client.post('/get_response',
                          data=json.dumps({}),
                          content_type='application/json')
    assert response.status_code == 200  # Should handle missing text gracefully 