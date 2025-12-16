import { login } from "../api/api";

export default function Login({ setAuth }) {
  const handleLogin = async () => {
    const phone = prompt("Enter phone");
    const data = await login(phone);
    localStorage.setItem("token", data.token);
    setAuth(true);
  };

  return <button onClick={handleLogin}>Login</button>;
}
