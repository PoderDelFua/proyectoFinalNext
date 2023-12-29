// pages/api/login.js
import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
    const users = JSON.parse(await readFile(usersFilePath, 'utf8'));
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      // Incluir el nombre de usuario en la respuesta
      res.status(200).json({ message: 'Login correcto', username: user.username });
    } else {
      res.status(401).json({ message: 'Datos incorrectos' });
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
