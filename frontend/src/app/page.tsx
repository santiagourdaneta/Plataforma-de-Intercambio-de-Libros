// frontend/src/app/page.tsx
import Link from 'next/link'; // Importa Link desde next/link

export default function HomePage() {
  return (
    <div>
      <h2>Bienvenido a la Plataforma de Intercambio de Libros</h2>
      <p>Regístrate o inicia sesión para empezar a intercambiar libros.</p>
      <p>
        <Link href="/register">Registrarse</Link> | <Link href="/login">Iniciar Sesión</Link>
      </p>
    </div>
  );
}