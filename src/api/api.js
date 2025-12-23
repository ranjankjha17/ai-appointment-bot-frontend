export const login = async (phone) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone })
  });
  return res.json();
};

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
