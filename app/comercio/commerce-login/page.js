// pages/comercio/commerce-login.js
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommerceLogin() {
  const [loginInfo, setLoginInfo] = useState({
    id: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/commerce-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginInfo),
    });

    if (response.ok) {
      const { commerceId } = await response.json();
      router.push(`/comercio/${commerceId}`);   
     } else {
      // Manejar errores de login aquí
      console.error('Error al iniciar sesión');
    }
  };

  return (
<form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-black mb-6 text-center">Iniciar Sesión Comercio</h2>
  <div className="mb-4">
    <label htmlFor="id" className="block text-gray-700 text-sm font-bold mb-2">ID del Comercio:</label>
    <input
      type="text"
      id="id"
      name="id"
      value={loginInfo.id}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="mb-6">
    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña:</label>
    <input
      type="password"
      id="password"
      name="password"
      value={loginInfo.password}
      onChange={handleChange}
      required
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
  <div className="flex items-center justify-between">
    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      Iniciar Sesión
    </button>
  </div>
</form>

  );
}
