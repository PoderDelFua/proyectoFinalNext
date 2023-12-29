"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UsuarioPage() {
  const [comercios, setComercios] = useState([]);
  const [city, setCity] = useState('');
  const [activity, setActivity] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      if (typeof window !== 'undefined') {
        window.location.href = `/usuario/${loggedInUser}`;

      }
    }
    fetchComercios();
  }, []);

  async function fetchComercios() {
    let url = '/api/filterCommerces';
    const params = new URLSearchParams();
    
    if (city) {
      params.append('city', city);
    }
    if (activity) {
      params.append('activity', activity);
    }
    if (id) {
      params.append('id', id);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setComercios(data);
      } else {
        console.error('Error al realizar la búsqueda');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor: ', error);
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
          <Link href="/register">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded">Registrar</button>
        </Link>
        </div>
      </nav>

      <div className="container mx-auto pt-20 text-black">
        <div className="flex gap-4 mb-4">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Buscar por ciudad..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Buscar por actividad..."
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          />
          <input
            className="flex-1 p-2 border border-gray-300 rounded-md"
            type="text"
            placeholder="Buscar por ID de comercio..."
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
            onClick={fetchComercios}
          >
            Buscar
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold mb-12 text-black">Comercios</h1>
        {comercios.length > 0 ? (
          comercios.map((comercio, index) => (
            <div key={index} className="mb-4 p-4 bg-white shadow rounded text-gray-800">
              <h2 className="text-2xl font-bold">{comercio.name}</h2>
              <p>CIF: {comercio.cif}</p>
              <p>Dirección: {comercio.address}</p>
              <p>Email: {comercio.email}</p>
              <p>Teléfono: {comercio.phone}</p>
              <p>Ciudad: {comercio.ciudad}</p>
              <p>Actividad: {comercio.actividad}</p>
            </div>
          ))
        ) : (
          <p className="text-center">No se encontraron comercios.</p>
        )}
      </div>
    </div>
  );
}
