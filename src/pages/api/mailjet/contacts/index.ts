/*
Archivo de routes
*/
import type { NextApiRequest, NextApiResponse } from 'next';
//import { getSession } from 'next-auth/client';

import { getAll, getList, get, post, put } from './controller';
import { isValidBody, isValidId } from './middleware';

// declarando el tipo de valor del json a enviar al front
type Data = {};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { ContactsList = '', contact_ID = '' } = req.query;
	const { method = '' } = req;
	// si la persona no esta logueado
	/* const session = await getSession({ req });
	if (session === null) {
		return res.status(401).end();
	} */
	switch (method.toLocaleUpperCase()) {
		case 'GET':
			if (contact_ID === '' && ContactsList === '') return getAll(req, res);
			// traer todas las contacto.
			else if (ContactsList !== '') return getList(req, res);
			// traer contactos de una lista
			else return get(req, res); // traer una contacto en especifica.

		case 'POST':
			if (!isValidBody(req, res)) break; // nombre,email vacio o invalido.
			// si todo sale bien
			return post(req, res);

		case 'PUT':
			if (!isValidBody(req, res)) break; // nombre,email vacio o invalido.
			if (!isValidId(req, res, contact_ID)) break; // id vacio.
			// si todo sale bien
			return put(req, res);

		// case 'DELETE':
		// 	if (!isValidId(req, res, contact_ID)) break; // id vacio.
		// 	// si todo sale bien
		// 	return delet(req, res);
		default:
			// si intentan enviar un método diferente a: get,post,put,delete.
			return res.status(404).json({
				msg: `${method} No es un método valido.`,
			});
	}
}
