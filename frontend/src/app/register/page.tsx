// frontend/src/app/register/page.tsx
'use client'; // <-- Indica que es un componente de cliente

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Para redirigir
import Link from 'next/link'; // Para enlaces internos

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      // Envía los datos al endpoint de registro del backend
      // Usamos /api/auth/register debido a la configuración del proxy en next.config.ts
      const { data } = await axios.post('/api/auth/register', {
        username,
        email,
        password,
      });

      setMessage('Registro exitoso. ¡Ahora puedes iniciar sesión!');
      setError(''); // Limpia errores previos
      router.push('/login'); // Redirige al usuario a la página de login
    } catch (err: any) {
      console.error('Error al registrar:', err);
      setMessage(''); // Limpia mensajes previos
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrar. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div>
      <h2>Registrarse</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de Usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <p>
        ¿Ya tienes una cuenta? <Link href="/login">Inicia Sesión aquí</Link>
      </p>
    </div>
  );
}