// frontend/src/app/books/add/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';

export default function AddBookPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirigir si no está autenticado después de cargar
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author || !condition) {
      setError('Por favor, completa los campos obligatorios: Título, Autor y Condición.');
      return;
    }

    if (!user?.token) {
      setError('No estás autenticado. Por favor, inicia sesión.');
      logout(); // Forzar logout si no hay token
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

      const { data } = await axios.post(
        '/api/books',
        { title, author, isbn, genre, condition, description },
        config
      );

      setMessage('¡Libro añadido exitosamente!');
      setError('');
      // Opcional: limpiar el formulario o redirigir
      setTitle('');
      setAuthor('');
      setIsbn('');
      setGenre('');
      setCondition('');
      setDescription('');
      router.push('/books'); // Redirigir a la lista de libros
    } catch (err: any) {
      console.error('Error al añadir libro:', err);
      setMessage('');
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else {
        setError('Error al añadir el libro. Por favor, inténtalo de nuevo.');
      }
      // Si el token expira o es inválido, forzar logout
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return <p>Cargando...</p>; // Esto se mostrará brevemente antes de la redirección
  }

  return (
    <div>
      <h2>Añadir Nuevo Libro</h2>
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
          {loading ? 'Añadiendo...' : 'Añadir Libro'}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <p style={{ marginTop: '1rem' }}>
        <Link href="/books">Volver a la lista de libros</Link>
      </p>
    </div>
  );
}