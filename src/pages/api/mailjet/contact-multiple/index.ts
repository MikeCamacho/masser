/*
Archivo de routes
*/
import type { NextApiRequest, NextApiResponse } from 'next';
//import { getSession } from 'next-auth/client';

import { post } from './controller';
import { isValidId } from './middleware';

// declarando el tipo de valor del json a enviar al front
type Data = {};
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	// si la persona no esta logueado
	/* const session = await getSession({ req });
	if (session === null) {
		return res.status(401).end();
	} */

	const { list_ID = '' } = req.query;
	const { method = '' } = req;

	switch (method.toLocaleUpperCase()) {
		case 'POST':
			if (!isValidId(req, res, list_ID)) break; // id vacio.
			if (list_ID !== '') return post(req, res);
			break;
		default:
			// si intentan enviar un método diferente a: get,post,put,delete.
			return res.status(404).json({
				msg: `${method} No es un método valido.`,
			});
	}
}
