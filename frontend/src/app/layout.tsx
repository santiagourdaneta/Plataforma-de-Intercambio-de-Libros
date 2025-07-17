// frontend/src/app/layout.tsx
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AuthNavigation from '../components/AuthNavigation';

export const metadata = {
  title: 'Plataforma Intercambio Libros',
  description: 'Plataforma para el intercambio de libros entre usuarios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* Envuelve tu aplicación con AuthProvider */}
        <AuthProvider>
          <header style={{ padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem', backgroundColor: '#e9ecef' }}>
            <nav style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem' }}>📚 Intercambio de Libros</h1>
              {/* Aquí añadiremos una navegación condicional */}
              <AuthNavigation /> {/* Nuevo componente para la navegación */}
            </nav>
          </header>
          <main style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
            {children}
          </main>
          <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #ccc', textAlign: 'center', backgroundColor: '#e9ecef', paddingBottom: '1rem' }}>
            <p>© 2025 Plataforma de Intercambio de Libros</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

// Opcional: Componente para la navegación basado en el estado de autenticación
// Puedes crear este archivo en frontend/src/components/AuthNavigation.tsx
// y luego importarlo aquí. Por ahora, lo pondremos aquí para simplificar.
import Link from 'next/link';

// NOTA: Para que AuthNavigation funcione como un cliente componente,
// o bien lo marcas con 'use client' al inicio de su propio archivo
// O, si lo defines directamente aquí como un subcomponente, asegúrate de
// que el componente padre (layout.tsx) no sea un componente de servidor
// que lo impida, o que el contexto se use en un contexto de cliente.
// Dado que `useAuth` requiere 'use client', lo más seguro es crear
// AuthNavigation como un archivo separado con 'use client'.

// Vamos a crear AuthNavigation en un archivo separado para buena práctica.