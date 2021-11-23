/*
Archivo de routes
*/

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAll, get, post, put, delet } from './controller';
import {
	isValidBody,
	isValidContactList,
	isValidDraftId,
	isValidStatus,
} from './middleware';
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
	const { draft_ID = '' } = req.query;
	const { method = '' } = req;

	switch (method.toLocaleUpperCase()) {
		case 'GET':
			// traer todas las contacto.
			if (draft_ID === '') return getAll(req, res);
			else {
				if (!isValidStatus(req, res, draft_ID)) break; // verificar el status
				return get(req, res); // traer una contacto en especifica.
			}
		case 'POST':
			if (!isValidBody(req, res)) break; // Locale, SenderName, SenderEmail, Subject, Title, ContactsListID vacio o invalido.
			if (!isValidContactList(req, res)) break; // lista de contacto invalida.
			// si todo sale bien
			return post(req, res);

		case 'PUT':
			if (!isValidDraftId(req, res, draft_ID)) break; // verificar el draft_ID.
			if (!isValidStatus(req, res, draft_ID)) break; // verificar el status
			if (!isValidContactList(req, res)) break; // lista de contacto invalida.
			// si todo sale bien
			return put(req, res);

		case 'DELETE':
			if (!isValidDraftId(req, res, draft_ID)) break; // verificar el draft_ID.
			if (!isValidStatus(req, res, draft_ID)) break; // verificar el status
			// si todo sale bien
			return delet(req, res, draft_ID);

		default:
			// si intentan enviar un método diferente a: get,post,put,delete.
			return res.status(404).json({
				msg: `${method} No es un método valido.`,
			});
	}
}
