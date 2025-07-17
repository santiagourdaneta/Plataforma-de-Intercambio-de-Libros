// frontend/src/app/books/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
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

export default function EditBookPage({ params }: { params: { id: string } }) {
  const { id } = params; // Get book ID from URL
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch book data for pre-populating the form
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    const fetchBook = async () => {
      if (!user?.token || !id) {
        setLoading(false);
        setError('No token or book ID found. Please log in or provide a valid ID.');
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/books`, config); // Fetch all books, then filter
        const fetchedBook = data.find((b: Book) => b._id === id);

        if (fetchedBook) {
          setBook(fetchedBook);
          setTitle(fetchedBook.title);
          setAuthor(fetchedBook.author);
          setIsbn(fetchedBook.isbn || '');
          setGenre(fetchedBook.genre || '');
          setCondition(fetchedBook.condition);
          setDescription(fetchedBook.description || '');
          setError('');
        } else {
          setError('Libro no encontrado o no tienes permiso para editarlo.');
        }
      } catch (err: any) {
        console.error('Error al cargar el libro para edición:', err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Error: ${err.response.data.message}`);
        } else {
          setError('Error al cargar el libro. Por favor, inténtalo de nuevo.');
        }
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchBook();
    }
  }, [user, authLoading, router, id, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !condition) {
      setError('Por favor, completa los campos obligatorios: Título, Autor y Condición.');
      return;
    }

    if (!user?.token || !id) {
      setError('No estás autenticado o falta el ID del libro. Por favor, inicia sesión.');
      logout();
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.put(
        `/api/books/${id}`,
        { title, author, isbn, genre, condition, description },
        config
      );

      setMessage('¡Libro actualizado exitosamente!');
      setError('');
      router.push('/books'); // Redirige a la lista de libros después de la actualización
    } catch (err: any) {
      console.error('Error al actualizar libro:', err);
      setMessage('');
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('Error al actualizar el libro. Por favor, inténtalo de nuevo.');
      }
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading || !user) {
    return <p>Cargando libro para edición...</p>;
  }

  if (error && !book) { // Show error if book couldn't be loaded at all
      return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <h2>Editar Libro: {book?.title}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Autor:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="condition">Condición:</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          >
            <option value="">Selecciona una condición</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Como nuevo">Como nuevo</option>
            <option value="Bueno">Bueno</option>
            <option value="Aceptable">Aceptable</option>
            <option value="Desgastado">Desgastado</option>
          </select>
        </div>
        <div>
          <label htmlFor="isbn">ISBN (Opcional):</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="genre">Género (Opcional):</label>
          <input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Descripción (Opcional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar Libro'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <p style={{ marginTop: '1rem' }}>
        <Link href="/books">Volver a Mis Libros</Link>
      </p>
    </div>
  );
}