// pages/api/register.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const user = req.body;
    try {
      const data = await fs.readFile(filePath, 'utf8');
      let users = JSON.parse(data || '[]');
      
      // Aquí podrías añadir lógica para verificar que el usuario no existe ya
      users.push(user);

      await fs.writeFile(filePath, JSON.stringify(users, null, 2));
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
