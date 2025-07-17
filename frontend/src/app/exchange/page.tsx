// frontend/src/app/exchange/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

// Update interface to include user details from populate
interface OtherBook {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  condition: string;
  description?: string;
  user: {
      _id: string;
      username: string; // These come from .populate('user', 'username email')
      email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ExchangePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [otherBooks, setOtherBooks] = useState<OtherBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchOtherBooks = async () => {
      if (!user?.token) {
        setLoading(false);
        setError('No token found. Please log in.');
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Call the new backend route for other users' books
        const { data } = await axios.get('/api/books/others', config);
        setOtherBooks(data);
        setError('');
      } catch (err: any) {
        console.error('Error al cargar libros de otros usuarios:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError('Error al cargar los libros de otros usuarios. Por favor, inténtalo de nuevo.');
        }
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOtherBooks();
    }
  }, [user, authLoading, router, logout]);

  if (authLoading || loading) {
    return <p>Cargando libros de otros usuarios...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
      return null;
  }

  return (
    <div>
      <h2>Libros en Intercambio</h2>
      {otherBooks.length === 0 ? (
        <p>No hay libros de otros usuarios disponibles para intercambio en este momento.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {otherBooks.map((book) => (
            <div key={book._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>{book.title}</h3>
              <p><strong>Autor:</strong> {book.author}</p>
              <p><strong>Condición:</strong> {book.condition}</p>
              {book.genre && <p><strong>Género:</strong> {book.genre}</p>}
              {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
              {book.description && <p style={{ fontSize: '0.9em', color: '#555' }}>{book.description}</p>}
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed #eee' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Ofrecido por:</p>
                  <p style={{ margin: '0.2rem 0', fontSize: '0.9em' }}>{book.user.username} ({book.user.email})</p>
                  {/* Aquí podrías añadir un botón "Proponer Intercambio" */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}