using UnityEngine;

public class SimpleCameraController : MonoBehaviour
{
    void Update()
    {
        float moveX = Input.GetAxis("Horizontal") * Time.deltaTime * 2f;
        float moveZ = Input.GetAxis("Vertical") * Time.deltaTime * 2f;
        transform.Translate(moveX, 0, moveZ);

        // Optional: Mouse look
        if (Input.GetMouseButton(1))
        {
            float rotX = Input.GetAxis("Mouse X") * 2f;
            float rotY = -Input.GetAxis("Mouse Y") * 2f;
            transform.Rotate(0, rotX, 0, Space.World);
            transform.Rotate(rotY, 0, 0, Space.Self);
        }
    }
} 