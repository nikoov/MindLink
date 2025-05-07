import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from openai import OpenAI
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('cbt_session.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
analyzer = SentimentIntensityAnalyzer()
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# CBT-specific system prompts
CBT_PROMPTS = {
    'initial': """You are a virtual patient in a CBT therapy session. You are experiencing anxiety and are seeking help. 
    Your responses should be natural, emotional, and reflect common anxiety symptoms. 
    Keep responses concise (2-3 sentences) and focus on expressing feelings and thoughts.""",
    
    'followup': """Continue the therapy session as the virtual patient. 
    Respond naturally to the therapist's interventions, showing appropriate emotional responses.
    If the therapist uses CBT techniques well, show gradual improvement.
    If the therapist's approach isn't helpful, express continued anxiety."""
}

def get_mqtt_client():
    client = mqtt.Client()
    try:
        client.connect("localhost", 1883, 60)
        return client
    except Exception as e:
        logger.error(f"MQTT connection failed: {e}")
        return None

def log_interaction(user_input, ai_response, sentiment_score):
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'user_input': user_input,
        'ai_response': ai_response,
        'sentiment_score': sentiment_score
    }
    
    with open('interaction_log.json', 'a') as f:
        json.dump(log_entry, f)
        f.write('\n')

@app.route('/get_response', methods=['POST'])
def get_response():
    try:
        data = request.json
        user_input = data.get('text', '')
        session_type = data.get('session_type', 'initial')
        
        # Get sentiment analysis
        emotion_score = analyzer.polarity_scores(user_input)['compound']
        
        # Prepare messages for GPT-4
        messages = [
            {"role": "system", "content": CBT_PROMPTS[session_type]},
            {"role": "user", "content": user_input}
        ]
        
        # Get GPT-4 response
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=150
        )
        
        ai_reply = response.choices[0].message.content
        
        # Log the interaction
        log_interaction(user_input, ai_reply, emotion_score)
        
        # Publish to MQTT if available
        mqtt_client = get_mqtt_client()
        if mqtt_client:
            mqtt_client.publish("cbt/session", json.dumps({
                'input': user_input,
                'response': ai_reply,
                'sentiment': emotion_score
            }))
            mqtt_client.disconnect()
        
        return jsonify({
            'reply': ai_reply,
            'sentiment': emotion_score
        })
        
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({
            'error': 'An error occurred processing your request',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True) 