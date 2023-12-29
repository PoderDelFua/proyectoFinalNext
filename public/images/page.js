"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Comercio( ) {
  const [comercios, setComercios] = useState([]);

  useEffect(() => {
    async function fetchComercios() {
      const response = await fetch('/api/commerces');
      if (response.ok) {
        const data = await response.json();
        setComercios(data);
      } else {
        // Manejar el error como consideres necesario
        console.error('Error al cargar los comercios');
      }
    }
    
    fetchComercios();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {<nav className="fixed top-0 left-0 w-full bg-blue-900 text-white flex justify-between items-center p-4 z-50">
        <div className="flex space-x-4">
        <Link href="/">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Home
            </div>
          </Link>
        <Link href="/admin">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Admin
            </div>
          </Link>
          <Link href="/comercio">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Comercio
            </div>
          </Link>
          <Link href="/usuario">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Usuario
            </div>
          </Link>
        </div>
      </nav>}
    {/* Contenido principal */}
    <div className="pt-20"> {/* Aumenta el padding-top para evitar solapamientos con la barra de navegación */}
        <h1 className="text-center text-3xl font-bold mb-12 text-black">Panel de Comercio</h1>
        {comercios.length > 0 ? (
          <div className="container mx-auto">
            {comercios.map((comercio, index) => (
              <div key={index} className="mb-4 p-4 bg-white shadow rounded text-gray-800">
                <Link href={`/comercio/${comercio.id}`} className="text-2xl font-bold">{comercio.name}</Link>
                <p>CIF: {comercio.cif}</p>
                <p>Dirección: {comercio.address}</p>
                <p>Email: {comercio.email}</p>
                <p>Teléfono: {comercio.phone}</p>
                {/* Continúa agregando los detalles que desees mostrar */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-black">No hay comercios registrados.</p>
        )}
      </div>  
    </div>
  );
}