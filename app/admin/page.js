"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid'; // Asegúrate de importar uuid

export default function AdminPage() {
  const [comercios, setComercios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [commerceInfo, setCommerceInfo] = useState({ // Debes definir este estado para los inputs del formulario
    id: '', // Incluir id en el estado inicial
    name: '',
    cif: '',
    address: '',
    email: '',
    phone: '',
    ciudad: '',
    scoring: 0,
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser !== 'admin') {
      alert('Debes ser admin para acceder a esta página.');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
    fetchComercios();
  }, []);

  async function fetchComercios() {
    try {
      const response = await fetch('/api/commerces');
      if (response.ok) {
        const data = await response.json();
        setComercios(data);
      } else {
        console.error('Error al cargar los comercios: ', response.statusText);
      }
    } catch (error) {
      console.error('Error al conectar con el servidor: ', error);
    }
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };
  const handleChange = (e) => {
    setCommerceInfo({ ...commerceInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCommerce = { ...commerceInfo, id: uuidv4() }; // Crea un nuevo objeto de comercio con un id único
    try {
      const response = await fetch('/api/commerces', { // La ruta es '/api/comercios', no '/api/registrar-comercio'
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCommerce),
      });
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Muestra un mensaje de éxito
        fetchComercios(); // Recargar la lista de comercios
      } else {
        const errorResult = await response.json();
        alert(errorResult.message || 'Error al registrar el comercio');
      }
    } catch (error) {
      alert('Error al conectar con el servidor');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/${id}`, { method: 'DELETE' });
      if (response.ok) {
        const updatedComercios = comercios.filter(comercio => comercio.id !== id);
        setComercios(updatedComercios);
        alert('Comercio eliminado con éxito');
      } else {
        alert('Error al eliminar el comercio');
      }
    } catch (error) {
      alert('Error al conectar con el servidor para eliminar el comercio');
    }
  };

  const filteredComercios = comercios.filter(comercio => {
    const searchTermLower = searchTerm.toLowerCase();
    return comercio.name.toLowerCase().includes(searchTermLower) ||
           (comercio.address && comercio.address.toLowerCase().includes(searchTermLower));
  });

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
      {/* Campo de búsqueda */}
      <input
        type="text"
        placeholder="Buscar comercio..."
        onChange={handleSearchChange}
        className="block w-full p-2 border border-gray-300 rounded-md text-black shadow-sm mt-16 mx-auto"
      />

    {/* Lista de comercios */}
    <div className="container mx-auto pt-20">
      <h1 className="text-center text-3xl font-bold mb-12 text-black">Comercios</h1>
      {comercios.length > 0 ? (
        filteredComercios.map((comercio, index) => (
          <div key={comercio.id} className="mb-4 p-4 bg-white shadow rounded text-gray-800">
            <h2 className="text-2xl font-bold">{comercio.name}</h2>
            <p>CIF: {comercio.cif}</p>
            <p>Dirección: {comercio.address}</p>
            <p>Email: {comercio.email}</p>
            <p>Teléfono: {comercio.phone}</p>
            <button 
              onClick={() => handleDelete(comercio.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-black">No hay comercios registrados.</p>
      )}
    </div>
      
      {/* Contenedor del formulario */}
      <div className="container mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h1 className="text-3xl font-bold text-black text-center mb-6">Panel de Administración</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del comercio
            </label>
            <input type="text" name="name" id="name" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="cif" className="block text-sm font-medium text-gray-700">
              CIF del comercio
            </label>
            <input type="text" name="cif" id="cif" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input type="text" name="address" id="address" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail del comercio
            </label>
            <input type="text" name="email" id="email" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Teléfono de contacto
            </label>
            <input type="text" name="phone" id="phone" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input type="password" name="password" id="password" onChange={handleChange} 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
          <button type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Registrar Comercio
          </button>
        </form>
      </div>
    </div>
  );
}