using UnityEngine;
using System;
using System.IO;
using System.Collections.Generic;
using System.Text;

public class SessionLogger : MonoBehaviour
{
    [Header("Logging Settings")]
    [SerializeField] private string logFileName = "cbt_session";
    [SerializeField] private bool logToFile = true;
    [SerializeField] private bool logToConsole = true;
    
    private string sessionId;
    private List<LogEntry> sessionLogs;
    private string logFilePath;
    
    private void Start()
    {
        sessionId = Guid.NewGuid().ToString();
        sessionLogs = new List<LogEntry>();
        
        if (logToFile)
        {
            string timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            logFilePath = Path.Combine(Application.persistentDataPath, $"{logFileName}_{timestamp}.json");
            LogSessionStart();
        }
    }
    
    public void LogInteraction(string userInput, string aiResponse, float sentiment, MoodState patientState)
    {
        var entry = new LogEntry
        {
            timestamp = DateTime.Now,
            userInput = userInput,
            aiResponse = aiResponse,
            sentiment = sentiment,
            patientState = patientState.ToString()
        };
        
        sessionLogs.Add(entry);
        
        if (logToFile)
            WriteLogToFile(entry);
            
        if (logToConsole)
            Debug.Log($"Session Log: {JsonUtility.ToJson(entry, true)}");
    }
    
    private void LogSessionStart()
    {
        var startEntry = new LogEntry
        {
            timestamp = DateTime.Now,
            eventType = "SessionStart",
            sessionId = sessionId
        };
        
        WriteLogToFile(startEntry);
    }
    
    private void LogSessionEnd()
    {
        var endEntry = new LogEntry
        {
            timestamp = DateTime.Now,
            eventType = "SessionEnd",
            sessionId = sessionId,
            totalInteractions = sessionLogs.Count
        };
        
        WriteLogToFile(endEntry);
    }
    
    private void WriteLogToFile(LogEntry entry)
    {
        try
        {
            string json = JsonUtility.ToJson(entry, true);
            File.AppendAllText(logFilePath, json + Environment.NewLine);
        }
        catch (Exception e)
        {
            Debug.LogError($"Failed to write to log file: {e.Message}");
        }
    }
    
    private void OnApplicationQuit()
    {
        if (logToFile)
            LogSessionEnd();
    }
    
    public string GetSessionId()
    {
        return sessionId;
    }
    
    public List<LogEntry> GetSessionLogs()
    {
        return new List<LogEntry>(sessionLogs);
    }
}

[Serializable]
public class LogEntry
{
    public DateTime timestamp;
    public string eventType;
    public string sessionId;
    public string userInput;
    public string aiResponse;
    public float sentiment;
    public string patientState;
    public int totalInteractions;
} 