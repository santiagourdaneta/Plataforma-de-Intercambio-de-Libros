// frontend/src/components/AuthNavigation.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function AuthNavigation() {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {user ? (
        <>
          <span style={{ color: '#007bff' }}>Hola, {user.username || user.email}!</span>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/books">Mis Libros</Link>
          <Link href="/exchange">Libros de Otros</Link> {/* New link */}
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>
            Cerrar Sesión
          </button>
        </>
      ) : (
        <>
          <Link href="/register">Registrarse</Link>
          <Link href="/login">Iniciar Sesión</Link>
        </>
      )}
    </div>
  );
}