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
	const { Offset = 0, Limit = 10 } = req.query;
	try {
		// traer todo las listas.
		const TotalAll = await mailjet
			.get('campaign', { version: 'v3' })
			.request({ countOnly: 1, Period: 'Year' });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('campaign', { version: 'v3' }).request({
			Offset,
			Limit,
			Period: 'Year',
			Sort: 'ID DESC',
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: TotalAll.body.Total,
			Message: 'Petición exitosa.',
		});
	} catch (error) {
		console.error('error campains send getAll:', error);
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
	const { campaign_ID = '' } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('campaign', { version: 'v3' })
			.id(campaign_ID)
			.request();

		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Petición exitosa.',
		});
	} catch (error: any) {
		console.error('error campaign draft get id:', error.message);
		if (error.message.includes('404 Object not found')) {
			// cunado el id es incorrecto
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message:
					'Error en la petición por favor verifique el ID de la campaña.',
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

// controller post
export const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { draft_ID, action } = req.body;
	try {
		// pruebas
		if (action.toLocaleLowerCase() === 'test') {
			const {
				body: { Data, Total },
			} = await mailjet
				.post('campaigndraft', { version: 'v3' })
				.id(draft_ID)
				.action(action)
				.request({
					Recipients: [
						{
							Email: 'noreply@marketing.masser.com.co',
							Name: 'masser',
						},
					],
				});

			return res.status(201).json({
				Data,
				Total,
				TotalAll: null,
				Message: 'Petición exitosa.',
			});
			// envio
		} else {
			const {
				body: { Data, Total },
			} = await mailjet
				.post('campaigndraft', { version: 'v3' })
				.id(draft_ID)
				.action(action)
				.request();

			return res.status(201).json({
				Data,
				Total,
				TotalAll: null,
				Message: 'Petición exitosa.',
			});
		}
	} catch (error: any) {
		console.error('error campaign send post: ', error.message);
		if (error.message.includes('404 Object not found')) {
			// cunado el id es incorrecto
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message:
					'Error en la petición por favor verifique el ID de la campaña.',
			});
		} else if (
			error.message.includes(
				'Newsletter has to be in status draft or programmed'
			)
		) {
			// cunado el id es incorrecto
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Esta campaña ya fué enviada.',
			});
		} else if (
			error.message.includes(
				'400 You need to specify a valid and active sender'
			)
		) {
			// cunado el id es incorrecto
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message:
					'Verifique que el correo electrónico del sender este registrado en la plataforma',
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
