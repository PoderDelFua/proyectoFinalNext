"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import commercesData from 'data/commerces.json'
import { useRouter } from 'next/navigation';

export default function ComercioDetalle() {
  const [comercio, setComercio] = useState(null);
  const [comercios, setComercios] = useState([]); // Estado para la lista de comercios
  const [emailsInteresados, setEmailsInteresados] = useState([]);
  const [formData, setFormData] = useState({
    ciudad: '',
    actividad: '',
    titulo: '',
    resumen: '',
    textos: [],
    fotos: [],
    scoring: 0,
    numeroPuntuaciones: 0,
    reseñas: []
  });
  const commerceId = useParams().id;
  const router = useRouter();
  useEffect(() => {
    if (commerceId) {
      const comercioEncontrado = commercesData.find(comercio => comercio.id === commerceId);
      if (comercioEncontrado) {
        setComercio(comercioEncontrado);
        handleGetEmailsForOffers();
        setFormData({
          ciudad: comercioEncontrado.ciudad || '',
          actividad: comercioEncontrado.actividad || '',
          titulo: comercioEncontrado.titulo || '',
          resumen: comercioEncontrado.resumen || '',
          textos: comercioEncontrado.textos || [],
          fotos: comercioEncontrado.fotos || [],
          scoring: comercioEncontrado.scoring || 0,
          numeroPuntuaciones: comercioEncontrado.numeroPuntuaciones || 0,
          reseñas: comercioEncontrado.reseñas || []
        });
      } else {
        console.error('No se encontró el comercio');
      }
    }
  }, [commerceId]);
  // Eliminar un comercio
  const handleDelete = async () => {
    // Lógica para eliminar el comercio
    try {
      const response = await fetch(`/api/comercios/${commerceId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        alert('Comercio eliminado con éxito');
        // Redirigir a otra página o actualizar el estado como sea necesario
      } else {
        throw new Error('Error al eliminar el comercio');
      }
    } catch (error) {
      console.error('Error al eliminar el comercio:', error);
      alert('Error al eliminar el comercio');
    }
  };
  const handleGetEmailsForOffers = async () => {
    if (comercio && comercio.ciudad && comercio.actividad) {
      try {
        const response = await fetch(`/api/obtenerEmailUsuarios?city=${comercio.ciudad}&interest=${comercio.actividad}`);
        if (response.ok) {
          const emails = await response.json();
          setEmailsInteresados(emails);
        } else {
          throw new Error('Error al obtener los correos electrónicos');
        }
      } catch (error) {
        console.error('Error al obtener correos electrónicos:', error);
        alert('Error al obtener correos electrónicos para ofertas');
      }
    } else {
      console.log('La información del comercio aún no está disponible.');
    }
  };
  
  
  
  

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/actualizarComercio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: commerceId,
          ...formData
        }),
      });
  
      if (response.ok) {
        alert('Comercio actualizado con éxito');
        // Aquí puedes actualizar el estado o hacer otras acciones según necesites
      } else {
        throw new Error('Error al actualizar el comercio');
      }
    } catch (error) {
      console.error('Error al actualizar el comercio:', error);
      alert('Error al actualizar el comercio');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white flex justify-between items-center p-4 z-50">
        <div className="flex space-x-4">
          <Link href="/">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">Home</div>
          </Link>
          <Link href="/admin">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">Admin</div>
          </Link>
          <Link href="/comercio/commerce-login">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">Comercio</div>
          </Link>
          <Link href="/usuario">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">Usuario</div>
          </Link>
        </div>
      </nav>
  
      {/* Contenido principal */}
      <div className="container mx-auto pt-20">
        <h1 className="text-center text-3xl font-bold mb-12 text-black">Panel de Comercio</h1>
        {comercio ? (
          <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto p-4 bg-white rounded shadow">
            {/* Campos editables */}
            <div className="mb-4">
              <label htmlFor="ciudad" className="block text-sm text-black font-medium text-gray-700">Ciudad</label>
              <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>
  
            {/* Repite el patrón para los otros campos... */}
            <div className="mb-4">
              <label htmlFor="actividad" className="block text-sm text-black font-medium text-gray-700">Actividad</label>
              <input type="text" id="actividad" name="actividad" value={formData.actividad} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>
            {/* Titulo */}
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-sm text-black font-medium text-gray-700">Titulo</label>
              <input type="text" id="titulo" name="titulo" value={formData.titulo} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>
            {/* Resumen */}
            <div className="mb-4">
              <label htmlFor="resumen" className="block text-sm text-black font-medium text-gray-700">Resumen</label>
              <input type="text" id="resumen" name="resumen" value={formData.resumen} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>            
            {/* Textos */}
            <div className="mb-4">
              <label htmlFor="textos" className="block text-sm text-black font-medium text-gray-700">Textos</label>
              <input type="text" id="textos" name="textos" value={formData.textos} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>            
            {/* Textos */}
            <div className="mb-4">
              <label htmlFor="fotos" className="block text-sm text-black font-medium text-gray-700">Fotos</label>
              <input type="text" id="fotos" name="fotos" value={formData.fotos} onChange={handleInputChange} className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-md" required />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Guardar Cambios</button>
          </form>
        ) : (
          <p className="text-center text-black">Cargando comercio...</p>
        )}
  
        {/* Detalle del Comercio */}
      <div className="container mx-auto pt-20">
        <h1 className="text-center text-3xl font-bold mb-12 text-black">Detalle del Comercio</h1>
        {comercio ? (
          <div className="mb-4 p-4 bg-white shadow rounded text-gray-800">
            <h2 className="text-2xl font-bold">{comercio.name}</h2>
            <p>CIF: {comercio.cif}</p>
            <p>Dirección: {comercio.address}</p>
            <p>Email: {comercio.email}</p>
            <p>Teléfono: {comercio.phone}</p>
            <p>Ciudad: {comercio.ciudad}</p>
            <p>Scoring: {comercio.scoring}</p>
            <p>Actividad: {comercio.actividad}</p>
            <p>Titulo: {comercio.titulo}</p>
            <p>Resumen: {comercio.resumen}</p>
            <p>Textos: {comercio.textos}</p>
            <img src={`/images/${comercio.fotos}`} alt={`Foto ${comercio.fotos}`} className="mb-4" />
            <button 
                onClick={() => handleDelete(comercio.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Eliminar
              </button>
          </div>
        ) : (
          <p className="text-center text-black">Cargando comercio...</p>
        )}
        </div>
        {comercio && (
         <div className="flex flex-col text-black items-center">
         {
        emailsInteresados.length > 0 && (
          <div className="container mx-auto pt-20">
            <h1 className="text-center text-3xl font-bold mb-12 text-black">Usuarios interesados:</h1>
            <div className="flex flex-wrap justify-center gap-4">
              {emailsInteresados.map((usuario, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md w-full md:w-1/3 lg:w-1/4">
                  <h3 className="text-xl font-bold">{usuario.nombre}</h3>
                  <p className="text-gray-600">Correo: {usuario.correo}</p>
                  <p className="text-gray-600">Interés: {usuario.interes}</p>
                </div>
              ))}
            </div>
          </div>
        )
      }

         <button
           onClick={handleGetEmailsForOffers}
           className="my-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
         >
           Obtener correos electrónicos para ofertas
         </button>
       </div>
      )}
      </div>
    </div>
  );
}