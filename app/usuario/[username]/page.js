"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function UserProfile() {
  const { username } = useParams();
  const [comercios, setComercios] = useState([]);
  const [permiteRecibirOfertas, setPermiteRecibirOfertas] = useState(false);

  useEffect(() => {
    fetchComercios();
    fetchUserPreferences();
  }, []);

  async function fetchComercios() {
    try {
      const response = await fetch('/api/commerces');
      if (response.ok) {
        const data = await response.json();
        setComercios(data);
      } else {
        console.error('Error al cargar los comercios');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
    }
  }

  async function fetchUserPreferences() {
    try {
      const response = await fetch(`/api/userPreferences?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setPermiteRecibirOfertas(data.permiteRecibirOfertas);
      }
    } catch (error) {
      console.error('Error al cargar las preferencias del usuario:', error);
    }
  }

  async function toggleUserPreferences() {
    try {
      const response = await fetch('/api/updatePreferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, permiteRecibirOfertas: !permiteRecibirOfertas }),
      });

      if (response.ok) {
        setPermiteRecibirOfertas(!permiteRecibirOfertas);
      } else {
        console.error('Error al actualizar las preferencias del usuario');
      }
    } catch (error) {
      console.error('Error al actualizar las preferencias:', error);
    }
  }
  const handleDeleteAccount = async () => {
    const confirmation = confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmation) {
      try {
        const response = await fetch(`/api/delete-user?username=${username}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Cuenta eliminada con éxito.');
          // Redirigir a la página de inicio o a donde consideres adecuado
          window.location.href = '/';
        } else {
          throw new Error('Error al eliminar la cuenta');
        }
      } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        alert('Error al eliminar la cuenta');
      }
    }
  };
  async function submitReview(commerceId, review, rating) {
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commerceId, review, rating }),
      });

      if (response.ok) {
        alert('Reseña enviada con éxito');
        fetchComercios();
      } else {
        alert('Error al enviar la reseña');
      }
    } catch (error) {
      console.error('Error al enviar la reseña:', error);
      alert('Error al enviar la reseña');
    }
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <nav className="bg-blue-900 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/">
            <div className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">
              Home
            </div>
          </Link>
          <Link href="/comercio/commerce-login">
            <div className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">
              Comercio
            </div>
          </Link>
          <Link href="/usuario">
            <div className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">
              Usuario
            </div>
          </Link>
        </div>
      </nav>

       {/* Saludo al usuario y botón de preferencias */}
       <div className="text-center text-black mt-6">
        <h1 className="text-4xl font-bold">¡Hola, {username}!</h1>
        <button 
          onClick={toggleUserPreferences} 
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {permiteRecibirOfertas ? 'Darme de baja en ofertas' : 'Quiero recibir ofertas'}
        </button>
      </div>

      {/* Lista de comercios con formularios para reseñas */}
      <div className="container mx-auto pt-10 text-black ">
        <h2 className="text-3xl font-bold mb-4">Comercios para puntuar y dejar reseñas</h2>
        {comercios.map((comercio, index) => (
          <div key={index} className="mb-4 p-4 bg-white shadow rounded">
            <h3 className="text-2xl font-bold">{comercio.name}</h3>
            {/* Formulario para enviar reseñas */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const review = e.target.review.value;
              const rating = e.target.rating.valueAsNumber;
              submitReview(comercio.id, review, rating);
            }}>
              <div className="mt-2">
                <label htmlFor={`review-${comercio.id}`} className="block text-lg font-medium">Tu reseña:</label>
                <textarea id={`review-${comercio.id}`} name="review" rows="3" className="w-full border rounded-md p-2" placeholder="Escribe tu reseña aquí"></textarea>
              </div>
              <div className="mt-2">
                <label htmlFor={`rating-${comercio.id}`} className="block text-lg font-medium">Tu puntuación:</label>
                <input id={`rating-${comercio.id}`} type="number" name="rating" min="1" max="5" className="border rounded-md p-2" placeholder="1-5" />
              </div>
              <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enviar Reseña</button>
            </form>
          </div>
        ))}
         {/* Botón para eliminar la cuenta */}
      <div className="text-center mt-4">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
        >
          Eliminar mi cuenta
        </button>
      </div>
      </div>
    </div>
  );
}
