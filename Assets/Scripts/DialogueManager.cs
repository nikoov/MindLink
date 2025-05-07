using UnityEngine;
using UnityEngine.UI;

public class DialogueManager : MonoBehaviour
{
    public InputField inputField;
    public Text replyText;
    public Button submitButton;
    public Animator npcAnimator;
    public ChatClient chatClient;

    void Start()
    {
        submitButton.onClick.AddListener(OnSubmit);
    }

    void OnSubmit()
    {
        string userInput = inputField.text;
        StartCoroutine(chatClient.GetResponse(userInput, (reply, sentiment) =>
        {
            replyText.text = reply;
            npcAnimator.SetTrigger(GetMoodTrigger(sentiment));
        }));
    }

    string GetMoodTrigger(float sentiment)
    {
        if (sentiment < -0.3f) return "ToNervous";
        if (sentiment > 0.3f) return "ToReassured";
        return "ToIdle";
    }
} 