# CBT Coach VR - Interactive Therapy Roleplay Simulation

A Unity-based VR simulation for mental health education where students practice anxiety-related CBT techniques with an AI-powered virtual patient.

## 🌟 Features

- **Immersive VR Environment**: Realistic therapy room setting with interactive elements
- **AI-Powered Patient**: Dynamic responses using GPT-4 integration
- **Real-time Emotion Analysis**: Sentiment analysis for patient mood tracking
- **Professional UI/UX**: Clean, accessible interface designed for therapeutic settings
- **Session Logging**: Comprehensive interaction tracking for learning analytics

## 🛠️ Technical Stack

- **Engine**: Unity 2022.3 LTS
- **VR SDK**: Unity XR Interaction Toolkit (OpenXR)
- **Backend**: Python + Flask
- **AI**: GPT-4 API
- **Sentiment Analysis**: TextBlob + VADER
- **Real-time Communication**: MQTT
- **Analytics**: JSON logging

## 📋 Prerequisites

- Unity 2022.3 LTS
- Python 3.8+
- VR Headset (Oculus Quest/Quest 2 recommended)
- OpenAI API Key

## 🚀 Getting Started

1. Clone the repository
2. Open the project in Unity 2022.3 LTS
3. Install required Unity packages:
   - XR Interaction Toolkit
   - TextMeshPro
   - Input System
   - Cinemachine
4. Set up Python environment:
   ```bash
   pip install -r requirements.txt
   ```
5. Configure OpenAI API key in `app.py`
6. Launch the Python backend:
   ```bash
   python app.py
   ```
7. Open the main scene in Unity and press Play

## 🎮 Controls

- **Grip**: Grab objects
- **Trigger**: Interact with UI
- **Thumbstick**: Teleport
- **Menu Button**: Open settings

## 📁 Project Structure

```
Assets/
├── Scenes/           # Unity scenes
├── Scripts/          # C# scripts
├── Prefabs/          # Reusable objects
├── UI/              # UI elements
├── NLPBridge/       # Python communication
├── Logging/         # Analytics
└── Materials/       # Visual assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Unity Technologies
- OpenAI
- TextBlob
- VADER Sentiment Analysis 