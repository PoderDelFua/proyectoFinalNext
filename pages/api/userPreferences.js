import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { username } = req.query;
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const users = JSON.parse(data);
      const user = users.find(u => u.username === username);

      if (user) {
        res.status(200).json({ permiteRecibirOfertas: user.permiteRecibirOfertas });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error al leer el archivo de usuarios', error });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
