import type { NextApiRequest, NextApiResponse } from 'next';
// declarando el tipo de valor del json a enviar al front
type Data = {
	Data: object | never;
	Total: number | null;
	TotalAll: object | null;
	Message: string;
};
// Initial mailjet
const mailjet = require('node-mailjet').connect(
	process.env.MJ_APIKEY_PUBLIC,
	process.env.MJ_APIKEY_PRIVATE
);

// controller post and PUT
export const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { list_ID = '' } = req.query;
	const contacts = JSON.parse(req.body);
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.post('contactslist', { version: 'v3' })
			.id(list_ID)
			.action('managemanycontacts')
			.request({
				Action: 'addnoforce',
				Contacts: contacts,
			});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Lista creada.',
		});
	} catch (error: any) {
		console.error(error.message);
		return res.status(500).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Error al intentar importar las propiedades de contactos.',
		});
	}
};
