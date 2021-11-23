/*
Archivo de routes
*/
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll, get, post, postMultiple, put, delet } from './controller';
import { isValidName, isValidId } from './middleware';
import { getSession } from 'next-auth/client';

// declarando el tipo de valor del json a enviar al front
type Data = {};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// si la persona no esta logueado
	// const session = await getSession({ req });
	// if (session === null) {
	// 	return res.status(401).end();
	// }

	const { list_ID = '' } = req.query;
	const { method = '' } = req;
	const { Name = '' } = req.body;

	switch (method.toLocaleUpperCase()) {
		case 'GET':
			if (list_ID === '') return getAll(req, res);
			// traer todas las lista.
			else return get(req, res); // traer una lista en especifica.

		case 'POST':
			if (!isValidName(req, res, Name)) break; // nombre vacio o invalido.
			return post(req, res);

		case 'PUT':
			if (!isValidName(req, res, Name)) break; // nombre vacio o invalido.
			if (!isValidId(req, res, list_ID)) break; // id vacio.
			// si todo sale bien
			return put(req, res);

		case 'DELETE':
			if (!isValidId(req, res, list_ID)) break; // id vacio.
			// si todo sale bien
			return delet(req, res);
		default:
			// si intentan enviar un método diferente a: get,post,put,delete.
			return res.status(404).json({
				msg: `${method} No es un método valido.`,
			});
	}
}
