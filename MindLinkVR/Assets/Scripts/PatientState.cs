using UnityEngine;
using System;

public class PatientState : MonoBehaviour
{
    [Header("Animation")]
    [SerializeField] private Animator animator;
    [SerializeField] private float transitionSpeed = 0.5f;
    
    [Header("Emotional States")]
    [SerializeField] private float nervousThreshold = -0.3f;
    [SerializeField] private float calmingThreshold = 0.1f;
    
    private MoodState currentState = MoodState.Neutral;
    private float currentSentiment = 0f;
    
    public event Action<MoodState> OnMoodChanged;
    
    private void Start()
    {
        if (animator == null)
            animator = GetComponent<Animator>();
            
        if (animator == null)
            Debug.LogError("No Animator component found on PatientState!");
    }
    
    public void UpdateMood(float sentiment)
    {
        currentSentiment = Mathf.Clamp(sentiment, -1f, 1f);
        MoodState newState = GetMoodState(currentSentiment);
        
        if (newState != currentState)
        {
            currentState = newState;
            UpdateAnimation();
            OnMoodChanged?.Invoke(currentState);
        }
    }
    
    private MoodState GetMoodState(float sentiment)
    {
        if (sentiment < nervousThreshold)
            return MoodState.Nervous;
        else if (sentiment < calmingThreshold)
            return MoodState.Calming;
        else
            return MoodState.Reassured;
    }
    
    private void UpdateAnimation()
    {
        if (animator != null)
        {
            // Reset all triggers
            animator.ResetTrigger("Nervous");
            animator.ResetTrigger("Calming");
            animator.ResetTrigger("Reassured");
            
            // Set new trigger
            animator.SetTrigger(currentState.ToString());
        }
    }
    
    public MoodState GetCurrentState()
    {
        return currentState;
    }
    
    public float GetCurrentSentiment()
    {
        return currentSentiment;
    }
}

public enum MoodState
{
    Nervous,
    Calming,
    Reassured
} 