/*
Archivo de routes
*/

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll, get } from './controller';
// import { isValidBody, isValidId } from './middleware';

// declarando el tipo de valor del json a enviar al front
type Data = {};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { Email = '', contactmetadata_ID = '' } = req.query;
	const { method = '' } = req;
	// verificar si es el email correcto.
	if (Email === process.env.NEXT_PUBLIC_EMAIL) {
		switch (method.toLocaleUpperCase()) {
			case 'GET':
				// traer todas las contacto.
				if (contactmetadata_ID === '') return getAll(req, res);
				else return get(req, res); // traer una contacto en especifica.

			case 'POST':

			case 'PUT':
				break;
			default:
				// si intentan enviar un método diferente a: get,post,put,delete.
				return res.status(404).json({
					msg: `${method} No es un método valido.`,
				});
		}
	} else {
		// si el correo no es valido.
		return res.status(403).json({
			msg: 'No posee permisos.',
		});
	}
}
