import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { username } = req.query;
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    try {
      const data = await fs.readFile(filePath, 'utf8');
      let users = JSON.parse(data);

      // Filtrar para eliminar el usuario
      users = users.filter(user => user.username !== username);

      // Guardar la nueva lista de usuarios
      await fs.writeFile(filePath, JSON.stringify(users, null, 2));
      res.status(200).json({ message: 'Usuario eliminado con éxito' });
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
