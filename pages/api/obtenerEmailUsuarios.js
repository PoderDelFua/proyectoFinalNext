import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { city, interest } = req.query;
  const filePath = path.join(process.cwd(), 'data', 'users.json');

  try {
    const data = await fs.readFile(filePath, 'utf8');
    const users = JSON.parse(data);

    const interestedUsers = users.filter(user =>
      user.ciudad.toLowerCase() === city.toLowerCase() ||
      user.intereses.toLowerCase() === interest.toLowerCase() &&
      user.permiteRecibirOfertas
    );

    res.status(200).json(interestedUsers.map(user => ({
        nombre: user.username,
        correo: user.email,
        interes: user.intereses
      })));  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la lista de usuarios', error: error.message });
  }
}
