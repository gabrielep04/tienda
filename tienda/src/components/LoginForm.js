import React, { useState } from 'react';
import { getUsers } from '../utils/db';
import './LoginForm.css';

const LoginForm = ({ onLoginSuccess, onToggleRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const users = await getUsers();
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      const token = btoa(`${user.username}:${new Date().toISOString()}`); // Crear un token simple
      localStorage.setItem('authToken', token); // Guardar token en localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(user)); // Guardar información del usuario
      onLoginSuccess(user);
    } else {
      setErrorMessage('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button type="submit">Entrar</button>
        <p>
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={onToggleRegister}>
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
