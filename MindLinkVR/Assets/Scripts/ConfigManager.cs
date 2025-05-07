using UnityEngine;

[CreateAssetMenu(fileName = "Config", menuName = "CBTCoach/Config")]
public class ConfigManager : ScriptableObject
{
    [Header("Backend Settings")]
    public string backendUrl = "http://localhost:5001";

    [Header("Audio Settings")]
    [Range(0f, 1f)]
    public float defaultVolume = 0.8f;
    public bool subtitlesEnabled = true;

    [Header("UI Settings")]
    public float uiDistance = 2f;
    public float uiHeight = 1.6f;

    [Header("Patient Settings")]
    public float nervousThreshold = -0.3f;
    public float calmingThreshold = 0.1f;

    [Header("Logging Settings")]
    public bool logToFile = true;
    public bool logToConsole = true;

    private static ConfigManager instance;
    public static ConfigManager Instance
    {
        get
        {
            if (instance == null)
            {
                instance = Resources.Load<ConfigManager>("Config");
                if (instance == null)
                {
                    Debug.LogError("Config asset not found in Resources folder!");
                    instance = CreateInstance<ConfigManager>();
                }
            }
            return instance;
        }
    }

    private void OnValidate()
    {
        // Ensure thresholds are properly ordered
        if (nervousThreshold > calmingThreshold)
        {
            Debug.LogWarning("Nervous threshold should be less than calming threshold");
            nervousThreshold = calmingThreshold - 0.2f;
        }

        // Ensure UI settings are reasonable
        uiDistance = Mathf.Max(1f, uiDistance);
        uiHeight = Mathf.Max(0.5f, uiHeight);
    }
} 