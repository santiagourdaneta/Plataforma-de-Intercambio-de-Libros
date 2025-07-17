// frontend/src/app/dashboard/page.tsx
'use client'; // Componente de cliente

import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa useAuth
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth(); // Obtén el usuario y el estado de carga del contexto
  const router = useRouter();

  useEffect(() => {
    // Si no está cargando y no hay usuario (no autenticado), redirige al login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Cargando información del usuario...</p>;
  }

  // Si no hay usuario (y ya terminó de cargar), significa que fue redirigido
  if (!user) {
    return null; // O un spinner, ya que router.push ya se encarga
  }

  // Si hay usuario, muestra el contenido del dashboard
  return (
    <div>
      <h2>Bienvenido al Dashboard, {user.username || user.email}!</h2>
      <p>Este es un área protegida, solo accesible para usuarios autenticados.</p>
      <h3>Tu información:</h3>
      <ul>
        <li>**ID:** {user._id}</li>
        <li>**Email:** {user.email}</li>
        <li>**Nombre de Usuario:** {user.username}</li>
        {/* Aquí puedes mostrar más detalles del usuario si tu token o backend los provee */}
      </ul>
      <p>
        <Link href="/books">Ver libros disponibles</Link> {/* Futura ruta */}
      </p>
    </div>
  );
}