// pages/api/commerce-login.js
import { readFile } from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'data', 'commerces.json');
    const commerces = JSON.parse(await readFile(filePath, 'utf8'));
    const { id, password } = req.body;

    const commerce = commerces.find(c => c.id === id && c.password === password);
    if (commerce) {
      res.status(200).json({ message: 'Login correcto', commerceId: commerce.id });
    } else {
      res.status(401).json({ message: 'Datos incorrectos' });
    }
  } else {
    res.status(405).end('Method Not Allowed');
  }
}
