import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from './components/Chat'
import Login from './components/Login'

function App() {
  const [count, setCount] = useState(0)
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  // return auth ? <Chat /> : <Login setAuth={setAuth} />;
  return auth ? (
    <Chat setAuth={setAuth} />
  ) : (
    <Login setAuth={setAuth} />
  );

}

export default App
