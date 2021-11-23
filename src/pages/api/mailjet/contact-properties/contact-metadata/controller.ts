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

// controller getAll
export const getAll = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		Campaign = '',
		ContactEmail = '',
		ContactsList = '',
		Offset = 0,
		Limit = 10,
	} = req.query;
	try {
		// traer todo las listas.
		const TotalAll = await mailjet
			.get('contactmetadata', { version: 'v3' })
			.request({ countOnly: 1 });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('contactmetadata', { version: 'v3' }).request({
			Campaign,
			ContactEmail,
			ContactsList,
			Offset,
			Limit,
			Sort: 'ID DESC',
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: TotalAll.body.Total,
			Message: 'Petición exitosa.',
		});
	} catch (error) {
		console.error('error contact-properties data getAll:', error);
		res.status(500).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Error en la petición intente mas tarde.',
		});
	}
};

// controller get
export const get = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { contactmetadata_ID = '' } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('contactmetadata', { version: 'v3' })
			.id(contactmetadata_ID)
			.request();

		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Petición exitosa.',
		});
	} catch (error: any) {
		console.error('error contact get id:', error.message);
		if (error.message.includes('404 Object not found')) {
			// cunado el id es incorrecto
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error en la petición por favor verifique el ID del contacto.',
			});
		} else {
			// error del servidor.
			return res.status(500).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error en la petición intente mas tarde.',
			});
		}
	}
};
