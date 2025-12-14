// import { useState } from "react";
// import { sendMessage } from "../api/api";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const handleSend = async () => {
//     if (!input) return;

//     setMessages([...messages, { role: "user", text: input }]);
//     const res = await sendMessage(input);

//     setMessages(prev => [...prev, { role: "bot", text: res.reply }]);
//     setInput("");
//   };

//   return (
//     <div style={{ width: 400, margin: "50px auto" }}>
//       <h2>AI Appointment Assistant</h2>

//       <div style={{ border: "1px solid #ccc", padding: 10, height: 300, overflowY: "auto" }}>
//         {messages.map((m, i) => (
//           <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left" }}>
//             <p><b>{m.role}:</b> {m.text}</p>
//           </div>
//         ))}
//       </div>

//       <input
//         value={input}
//         onChange={e => setInput(e.target.value)}
//         placeholder="Book appointment..."
//         style={{ width: "100%", padding: 8 }}
//       />
//       <button onClick={handleSend} style={{ width: "100%", marginTop: 8 }}>
//         Send
//       </button>
//     </div>
//   );
// }



import { useState, useRef } from "react";
import { sendMessage } from "../api/api";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const recognitionRef = useRef(null);

  // 🎤 Start Voice Recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN"; // Hindi + English mix
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      handleSend(spokenText);
    };

    recognition.onerror = (err) => {
      console.error("Voice error:", err);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 💬 Send Message (Text or Voice)
  const handleSend = async (text = input) => {
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);

    const res = await sendMessage(text);

    setMessages((prev) => [...prev, { role: "bot", text: res.reply }]);
    setInput("");
  };

  return (
    <div style={{ width: 420, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>🧠 AI Appointment Assistant</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 320,
          overflowY: "auto",
          borderRadius: 6
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              marginBottom: 6
            }}
          >
            <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type or speak..."
        style={{ width: "100%", padding: 8, marginTop: 8 }}
      />

      <button
        onClick={() => handleSend()}
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
