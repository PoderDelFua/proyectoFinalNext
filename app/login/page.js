// login.client.js
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', data.username); // Ensure this is the correct key and value
        window.location.href = '/';
      }
       else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg border border-gray-300 p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-8 text-center text-black">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">  
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
