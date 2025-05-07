using UnityEngine;
using UnityEngine.Networking;
using System;
using System.Collections;
using System.Collections.Generic;

public class ChatClient : MonoBehaviour
{
    [SerializeField] private string apiEndpoint = "http://localhost:5000";
    [SerializeField] private float requestTimeout = 10f;
    
    public event Action<string, float> OnResponseReceived;
    public event Action<string> OnError;

    private void Start()
    {
        // Test connection on start
        StartCoroutine(TestConnection());
    }

    private IEnumerator TestConnection()
    {
        using (UnityWebRequest request = UnityWebRequest.Get($"{apiEndpoint}/health"))
        {
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError($"Failed to connect to backend: {request.error}");
                OnError?.Invoke($"Failed to connect to backend: {request.error}");
            }
            else
            {
                Debug.Log("Successfully connected to backend");
            }
        }
    }

    public void SendMessage(string message, string sessionType = "initial")
    {
        StartCoroutine(SendMessageCoroutine(message, sessionType));
    }

    private IEnumerator SendMessageCoroutine(string message, string sessionType)
    {
        var requestData = new Dictionary<string, string>
        {
            { "text", message },
            { "session_type", sessionType }
        };

        string jsonData = JsonUtility.ToJson(new RequestData { text = message, session_type = sessionType });

        using (UnityWebRequest request = new UnityWebRequest($"{apiEndpoint}/get_response", "POST"))
        {
            byte[] bodyRaw = System.Text.Encoding.UTF8.GetBytes(jsonData);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            request.timeout = (int)(requestTimeout * 1000);

            yield return request.SendWebRequest();

            if (request.result == UnityWebRequest.Result.Success)
            {
                try
                {
                    ResponseData response = JsonUtility.FromJson<ResponseData>(request.downloadHandler.text);
                    OnResponseReceived?.Invoke(response.reply, response.sentiment);
                }
                catch (Exception e)
                {
                    Debug.LogError($"Failed to parse response: {e.Message}");
                    OnError?.Invoke($"Failed to parse response: {e.Message}");
                }
            }
            else
            {
                Debug.LogError($"Request failed: {request.error}");
                OnError?.Invoke($"Request failed: {request.error}");
            }
        }
    }

    public IEnumerator GetResponse(string inputText, Action<string, float> callback)
    {
        string json = "{\"text\":\"" + inputText + "\"}";
        UnityWebRequest req = UnityWebRequest.Put("http://localhost:5001/get_response", json);
        req.method = UnityWebRequest.kHttpVerbPOST;
        req.SetRequestHeader("Content-Type", "application/json");

        yield return req.SendWebRequest();

        if (req.result == UnityWebRequest.Result.Success)
        {
            var data = JsonUtility.FromJson<ResponseData>(req.downloadHandler.text);
            callback?.Invoke(data.reply, data.sentiment);
        }
        else
        {
            callback?.Invoke("Error contacting backend.", 0);
        }
    }

    [Serializable]
    private class RequestData
    {
        public string text;
        public string session_type;
    }

    [Serializable]
    private class ResponseData
    {
        public string reply;
        public float sentiment;
    }
} 