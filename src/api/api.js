// export async function sendMessage(message) {
//   const res = await fetch("http://localhost:5000/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message })
//   });

//   return res.json();
// }



// export async function sendMessage(message) {
//   // 🧠 Create or reuse session ID
//   let sessionId = localStorage.getItem("sessionId");

//   if (!sessionId) {
//     sessionId = crypto.randomUUID();
//     localStorage.setItem("sessionId", sessionId);
//   }

//   const res = await fetch("http://localhost:5000/api/chat", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       message,
//       sessionId // 👈 IMPORTANT
//     })
//   });

//   return res.json();
// }


export const login = async (phone) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  return res.json();
};

// export async function sendMessage(message) {
//   let sessionId = localStorage.getItem("sessionId");

//   if (!sessionId) {
//     sessionId = crypto.randomUUID();
//     localStorage.setItem("sessionId", sessionId);
//   }

//   const res = await fetch("http://localhost:5000/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ message, sessionId })
//   });

//   return res.json();
// }



export const sendMessage = async (message, sessionId) => {
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ message, sessionId })
  });
  return res.json();
};


export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("sessionId");
};
