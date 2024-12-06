import React, { useState } from 'react';
import { addUser, getUsers } from '../utils/db';
import './AdminRegisterForm.css';
import ParticlesBg from 'particles-bg';

const AdminRegisterForm = ({ onToggleRegister, onToggleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    const COMPANY_PASSWORD = '1234';
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Validar campos obligatorios
    if (!username || !password || !confirmPassword || !companyPassword) {
      setErrorMessage('Todos los campos son obligatorios');
      setSuccessMessage('');
      return;
    }

    if (!usernameRegex.test(username)) {
      setErrorMessage('El nombre de usuario solo puede contener letras, números y guiones bajos, sin espacios.');
      setSuccessMessage('');
      return;
    }

    if (!usernameRegex.test(password)) {
      setErrorMessage('La contraseña de usuario solo puede contener letras, números y guiones bajos, sin espacios.');
      setSuccessMessage('');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      setSuccessMessage('');
      return;
    }

    // Validar contraseña de la empresa
    if (companyPassword !== COMPANY_PASSWORD) {
      setErrorMessage('Contraseña de empresa incorrecta');
      setSuccessMessage('');
      return;
    }

    try {
      // Verificar si el usuario ya existe
      const existingUsers = await getUsers();
      const userExists = existingUsers.some((user) => user.username === username);

      if (userExists) {
        setErrorMessage('El nombre de usuario ya está en uso');
        setSuccessMessage('');
        return;
      }

      // Registrar nuevo administrador
      await addUser({ username, password, role: 'admin' });
      setErrorMessage('');
      setSuccessMessage('Registro como administrador exitoso');
      onToggleLogin(); // Redirigir a la vista de inicio de sesión
    } catch (error) {
      console.error('Error al registrar el administrador:', error);
      setErrorMessage('Hubo un error durante el registro');
      setSuccessMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  let config = {
    num: [1, 2],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [0.1, 0.3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: "all", 
    color: ["#005bb5"], 
    cross: "dead", 
    random: 5,  
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    }
  };

  let config1 = {
    num: [1, 2],
    rps: 0.1,
    radius: [5, 40],
    life: [1.5, 3],
    v: [0.1, 0.3],
    tha: [-40, 40],
    alpha: [0.6, 0],
    scale: [1, 0.1],
    position: "all", 
    color: ["#FFC220"], 
    cross: "dead", 
    random: 5, 
    onParticleUpdate: (ctx, particle) => {
      ctx.beginPath();
      ctx.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, false);
      ctx.fillStyle = particle.color;
      ctx.fill();
      ctx.closePath();
    }
  };

  return (
    <div className="admin-register-form-container">
      <ParticlesBg type="custom" config={config} bg={true} />
      <ParticlesBg type="custom" config={config1} bg={true} />
      <form className="admin-register-form" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
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
        <div>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña de la empresa:</label>
          <input
            type="password"
            value={companyPassword}
            onChange={(e) => setCompanyPassword(e.target.value)}
          />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit">Registrarse como Administrador</button>
        <p>
        <button type="button" onClick={onToggleRegister}>
          Volver al registro estándar
        </button>
        </p>
        <p>
        <button type="button" onClick={onToggleLogin}>
          ¿Ya tienes una cuenta? Inicia sesión
        </button>
        </p>
      </form>
    </div>
  );
};

export default AdminRegisterForm;
