// pages/api/users.js
import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const users = JSON.parse(data);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
  } else if (req.method === 'PUT') {
    const { username, ...updateData } = req.body;
    try {
      const data = await fs.readFile(filePath, 'utf8');
      let users = JSON.parse(data);

      const userIndex = users.findIndex(user => user.username === username);
      if (userIndex === -1) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }

      users[userIndex] = { ...users[userIndex], ...updateData };
      await fs.writeFile(filePath, JSON.stringify(users, null, 2));
      res.status(200).json({ message: 'Usuario actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el usuario', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
