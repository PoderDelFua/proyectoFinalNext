// pages/register.js
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    edad: '',
    ciudad: '',
    intereses: '',
    permiteRecibirOfertas: false,
  });
  const router = useRouter();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirigir a la página de usuarios registrados
        router.push(`/usuario/${formData.username}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Algo salió mal');
      }
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      alert('Error al registrar el usuario');
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <h1 className="text-2xl font-bold text-center text-black mb-4">Registrar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Nombre:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">E-mail:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Password:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Edad:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="number"
            name="edad"
            value={formData.edad}
            onChange={handleChange}
            placeholder="Edad"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Ciudad:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            placeholder="Ciudad"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Intereses:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            name="intereses"
            value={formData.intereses}
            onChange={handleChange}
            placeholder="Intereses"
          />
        </div>
        <div>
          <label className="flex items-center mb-2">
            <input
              type="checkbox"
              name="permiteRecibirOfertas"
              checked={formData.permiteRecibirOfertas}
              onChange={handleChange}
            />
            <span className="ml-2">Permite recibir ofertas</span>
          </label>
        </div>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Registrar
        </button>
      </form>
    </div>
  );
}