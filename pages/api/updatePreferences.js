import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, permiteRecibirOfertas } = req.body;
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    try {
      const data = await fs.readFile(filePath, 'utf8');
      let users = JSON.parse(data);
      const userIndex = users.findIndex(u => u.username === username);

      if (userIndex !== -1) {
        users[userIndex].permiteRecibirOfertas = permiteRecibirOfertas;
        await fs.writeFile(filePath, JSON.stringify(users, null, 2));
        res.status(200).json({ message: 'Preferencias actualizadas con éxito' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar las preferencias del usuario', error });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
