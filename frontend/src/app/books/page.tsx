// frontend/src/app/books/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  condition: string;
  description?: string;
  user: string; // ID del usuario
  createdAt: string;
  updatedAt: string;
}

export default function BooksPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For success messages like "Book deleted"

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchBooks = async () => {
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
        const { data } = await axios.get('/api/books', config);
        setBooks(data);
        setError('');
        setMessage(''); // Clear previous messages on fetch
      } catch (err: any) {
        console.error('Error al cargar libros:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError('Error al cargar los libros. Por favor, inténtalo de nuevo.');
        }
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBooks();
    }
  }, [user, authLoading, router, logout]);

  // Handle book deletion
  const handleDelete = async (bookId: string) => {
    if (!user?.token || !confirm('¿Estás seguro de que quieres eliminar este libro?')) {
      return;
    }

    try {
      setLoading(true); // Show loading state during deletion
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete(`/api/books/${bookId}`, config);
      setBooks(books.filter((book) => book._id !== bookId)); // Remove deleted book from state
      setMessage('Libro eliminado exitosamente.');
      setError('');
    } catch (err: any) {
      console.error('Error al eliminar libro:', err);
      setMessage('');
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('Error al eliminar el libro. Por favor, inténtalo de nuevo.');
      }
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };


  if (authLoading || loading) {
    return <p>Cargando libros...</p>;
  }

  if (!user) {
      return null;
  }

  return (
    <div>
      <h2>Mis Libros</h2>
      <Link href="/books/add" style={{ display: 'inline-block', marginBottom: '1rem', padding: '0.8rem 1.2rem', backgroundColor: '#28a745', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
        + Añadir Nuevo Libro
      </Link>
      {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {books.length === 0 ? (
        <p>No tienes libros añadidos aún. ¡Añade el primero!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {books.map((book) => (
            <div key={book._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#007bff', marginBottom: '0.5rem' }}>{book.title}</h3>
              <p><strong>Autor:</strong> {book.author}</p>
              <p><strong>Condición:</strong> {book.condition}</p>
              {book.genre && <p><strong>Género:</strong> {book.genre}</p>}
              {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
              {book.description && <p style={{ fontSize: '0.9em', color: '#555' }}>{book.description}</p>}
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Link href={`/books/edit/${book._id}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(book._id)}
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}