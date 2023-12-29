// Home.js
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState('/images/sinLogin.jpg');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUserProfileImage(`/images/logo${loggedInUser}.jpg`);
    }
    fetch('/api/commerces')
    .then((response) => response.json())
    .then((data) => setComercios(data))
    .catch((error) => console.error('Error al cargar comercios:', error));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUserProfileImage('/images/sinLogin.jpg');
  };
  return (
    <main style={{ backgroundImage: `url('/images/ovejas.gif')`, backgroundSize: 'cover' }} className="min-h-screen flex flex-col items-center justify-center p-6 bg-no-repeat bg-center">
      <nav className="fixed top-0 left-0 w-full bg-blue-900 text-white flex justify-between items-center p-4 z-50">
        <div className="flex space-x-4">
          {isLoggedIn && (
            <div onClick={handleLogout} className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Cerrar Sesión
            </div>
          )}
          <Link href="/admin">
            <div className="cursor-pointer p-2 bg-blue-700 hover:bg-blue-800 rounded transition ease-in-out duration-300">
              Admin
            </div>
          </Link>
          <Link href={"/comercio/commerce-login"}>
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
        <div>
          {isLoggedIn ? (
            <Image src={userProfileImage} alt="Perfil" width={40} height={40} className="rounded-full" />
          ) : (
            <Link href="/login">
              <div className="cursor-pointer p-2 bg-blue-500 hover:bg-blue-600 rounded transition ease-in-out duration-300">
                Iniciar Sesión
              </div>
            </Link>
          )}
        </div>
      </nav>
      {/* ... el resto de tu componente */}
    </main>
  );
}
