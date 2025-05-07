using UnityEngine;

public class PatientAnimatorController : MonoBehaviour
{
    public Animator animator;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1)) animator.SetTrigger("ToNervous");
        if (Input.GetKeyDown(KeyCode.Alpha2)) animator.SetTrigger("ToIdle");
        if (Input.GetKeyDown(KeyCode.Alpha3)) animator.SetTrigger("ToReassured");
    }
} 