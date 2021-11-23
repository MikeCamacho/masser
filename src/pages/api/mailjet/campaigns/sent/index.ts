/*
Archivo de routes
*/

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll, get, post } from './controller';
import { isValidDraftId, isValidAction } from './middleware';
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
	const { campaign_ID = '' } = req.query;
	const { draft_ID = '', action = '' } = req.body;
	const { method = '' } = req;

	switch (method.toLocaleUpperCase()) {
		case 'GET':
			// traer todas las contacto.
			if (campaign_ID === '') return getAll(req, res);
			else return get(req, res); // traer una contacto en especifica.
		case 'POST':
			if (!isValidDraftId(req, res, draft_ID)) break; // verificar el draft_ID.
			if (!isValidAction(req, res, action)) break; // verificar la acción
			return post(req, res);
		default:
			// si intentan enviar un método diferente a: get,post,put,delete.
			return res.status(404).json({
				msg: `${method} No es un método valido.`,
			});
	}
}
