# MindLinkVR: CBT Coach Simulation

A professional, immersive VR and web-based simulation platform for mental health education. MindLinkVR enables students and professionals to practice Cognitive Behavioral Therapy (CBT) techniques with an AI-powered virtual patient, featuring real-time emotion analysis, voice interaction, and comprehensive session analytics.

---

## 🌟 Key Features

- **Immersive VR Environment**: Realistic therapy room simulation in Unity for hands-on CBT practice.
- **AI-Powered Virtual Patient**: Dynamic, emotionally responsive patient powered by GPT-4.
- **Real-Time Emotion Analysis**: Sentiment tracking using TextBlob and VADER.
- **Voice Interaction**: Speech-to-text and text-to-speech for natural, hands-free communication.
- **Professional UI/UX**: Clean, accessible web interface for session control and analytics.
- **Session Logging & Analytics**: Detailed tracking of interactions and learning progress.
- **Bloom's Taxonomy Progression**: Adaptive feedback and skill progression for therapist training.
- **Secure by Design**: Sensitive data (API keys, .env) is never committed to the repository.

---

## 🛠️ Technical Stack

- **VR Engine**: Unity 2022.3 LTS (C#)
- **Frontend**: React + TypeScript + Vite (web dashboard)
- **Backend**: Python (Flask API)
- **AI**: OpenAI GPT-4 API
- **Sentiment Analysis**: TextBlob, VADER
- **Real-Time Communication**: MQTT
- **Voice**: Web Speech API, ElevenLabs (optional)
- **Session Analytics**: JSON logging

---

## 📁 Project Structure

```
unity project/
├── MindLinkVR/         # Unity VR project (C#, Python backend)
│   ├── Assets/
│   ├── Scripts/
│   ├── Scenes/
│   ├── app.py          # Flask backend for AI and analytics
│   └── requirements.txt
├── frontend/           # React + TypeScript web dashboard
│   ├── src/
│   ├── public/
│   └── package.json
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Unity 2022.3 LTS
- Python 3.8+
- Node.js 16+
- VR Headset (Oculus Quest/Quest 2 recommended)
- OpenAI API Key

### 1. Clone the Repository

```bash
git clone https://github.com/nikoov/MindLink.git
cd MindLink
```

### 2. Backend Setup (Python)

```bash
cd MindLinkVR
pip install -r requirements.txt
# Copy .env.example to .env and add your OpenAI API key
cp .env.example .env
# Edit .env to add your OPENAI_API_KEY
python app.py
```

### 3. Unity VR Setup

- Open the `MindLinkVR` folder in Unity 2022.3 LTS.
- Install required Unity packages:
  - XR Interaction Toolkit
  - TextMeshPro
  - Input System
  - Cinemachine
- Open the main scene and press Play.

### 4. Frontend Setup (Web Dashboard)

```bash
cd frontend
npm install
npm run dev
```

---

## 🎮 Controls (VR)

- **Grip**: Grab objects
- **Trigger**: Interact with UI
- **Thumbstick**: Teleport
- **Menu Button**: Open settings

---

## 🧑‍💻 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Create a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Unity Technologies
- OpenAI
- TextBlob
- VADER Sentiment Analysis
- ElevenLabs
- All contributors 
