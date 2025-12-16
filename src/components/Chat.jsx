// import { useState, useRef } from "react";
// import { sendMessage } from "../api/api";

// export default function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const recognitionRef = useRef(null);

//   // 🎤 Voice Recognition
//   const startListening = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech Recognition not supported");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.lang = "hi-IN"; // default: Hindi+English
//     recognition.interimResults = false;
//     recognition.continuous = false;

//     recognition.onresult = (event) => {
//       const spokenText = event.results[0][0].transcript;
//       setInput(spokenText);
//       handleSend(spokenText);
//     };

//     recognition.onerror = (err) => console.error("Voice error:", err);
//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   // 🗣️ Text-to-Speech with Language Detection
//   const speak = (text) => {
//     if (!window.speechSynthesis) return;

//     // Detect language: simple check for Hindi characters
//     const isHindi = /[\u0900-\u097F]/.test(text);

//     const utterance = new SpeechSynthesisUtterance(text);
//     const voices = window.speechSynthesis.getVoices();

//     // Select voice based on language
//     if (isHindi) {
//       utterance.voice =
//         voices.find((v) => v.lang.includes("hi")) || voices[0];
//       utterance.lang = "hi-IN";
//     } else {
//       utterance.voice =
//         voices.find((v) => v.lang.includes("en")) || voices[0];
//       utterance.lang = "en-US";
//     }

//     utterance.rate = 1;
//     utterance.pitch = 1;

//     window.speechSynthesis.cancel(); // Stop previous speech
//     window.speechSynthesis.speak(utterance);
//   };

//   // 💬 Send message
//   const handleSend = async (text = input) => {
//     if (!text) return;

//     setMessages((prev) => [...prev, { role: "user", text }]);
//     setInput("");

//     try {
//       const res = await sendMessage(text);

//       setMessages((prev) => [...prev, { role: "bot", text: res.reply }]);

//       // Speak reply in detected language
//       setTimeout(() => speak(res.reply), 200);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div style={{ width: 420, margin: "40px auto", fontFamily: "Arial" }}>
//       <h2>🧠 AI Appointment Assistant</h2>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: 10,
//           height: 320,
//           overflowY: "auto",
//           borderRadius: 6,
//         }}
//       >
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             style={{
//               textAlign: m.role === "user" ? "right" : "left",
//               marginBottom: 6,
//             }}
//           >
//             <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
//           </div>
//         ))}
//       </div>

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type or speak..."
//         style={{ width: "100%", padding: 8, marginTop: 8 }}
//       />

//       <button
//         onClick={() => handleSend()}
//         style={{ width: "100%", marginTop: 6 }}
//       >
//         Send
//       </button>

//       <button
//         onClick={startListening}
//         style={{
//           width: "100%",
//           marginTop: 6,
//           background: "#0d6efd",
//           color: "#fff",
//           padding: 8,
//         }}
//       >
//         🎤 Speak (Hindi / English)
//       </button>
//     </div>
//   );
// }





import { useState, useRef } from "react";
import { logout, sendMessage } from "../api/api";

export default function Chat({ setAuth }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);
  const sessionId = localStorage.getItem("sessionId") ||
    crypto.randomUUID();

  localStorage.setItem("sessionId", sessionId);
  const handleLogout = () => {
    logout();
    setAuth(false);
  };

  // 🎤 START VOICE INPUT
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Hindi + English
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      send(spokenText);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 🗣️ VOICE REPLY (AUTO LANGUAGE)
  const speak = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Detect Hindi characters
    const isHindi = /[\u0900-\u097F]/.test(text);
    utterance.lang = isHindi ? "hi-IN" : "en-US";

    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find(v => v.lang === utterance.lang) || voices[0];

    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.speak(utterance);
  };

  // 💬 SEND MESSAGE (TEXT OR VOICE)
  const send = async (msg = input) => {
    if (!msg) return;

    setMessages(prev => [...prev, { role: "user", text: msg }]);
    setInput("");

    const res = await sendMessage(msg);

    setMessages(prev => [...prev, { role: "assistant", text: res.reply }]);

    // 🗣️ Speak AI reply
    setTimeout(() => speak(res.reply), 200);
  };

  return (
    <div style={{ width: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h3>🧠 AI Appointment Assistant</h3>
      <button onClick={handleLogout}>🚪 Logout</button>
      <div
        style={{
          border: "1px solid #ccc",
          height: 320,
          overflowY: "auto",
          padding: 10,
          borderRadius: 6
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or speak..."
        style={{ width: "100%", marginTop: 8, padding: 8 }}
      />

      <button
        onClick={() => send()}
        style={{ width: "100%", marginTop: 6 }}
      >
        Send
      </button>

      <button
        onClick={startListening}
        style={{
          width: "100%",
          marginTop: 6,
          background: "#0d6efd",
          color: "#fff",
          padding: 8
        }}
      >
        🎤 Speak (Hindi / English)
      </button>
    </div>
  );
}
