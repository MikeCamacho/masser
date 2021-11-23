import type { NextApiRequest, NextApiResponse } from 'next';
import {
	controllerGetDraft,
	controllerPutDraft,
	controllerPutDraftTemplate,
} from './controllerPut';
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
			.get('campaigndraft', { version: 'v3' })
			.request({ countOnly: 1 });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('campaigndraft', { version: 'v3' }).request({
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
		console.error('error campains drafts getAll:', error);
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
	const { draft_ID = '' } = req.query;
	const { method = '' } = req;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('campaigndraft', { version: 'v3' })
			.id(draft_ID)
			.request();
		if (method.toLocaleUpperCase() === 'GET') {
			return res.status(201).json({
				Data,
				Total,
				TotalAll: null,
				Message: 'Petición exitosa.',
			});
		} else return Data;
	} catch (error: any) {
		console.error('error contact get id:', error.message);
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
	const {
		Locale = '',
		SenderName = '',
		SenderEmail = '',
		Subject = '',
		Title = '',
		ContactsListID = 0,
		Headers,
		HtmlPart,
		MJMLContent,
		TextPart,
	} = req.body;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.post('campaigndraft', { version: 'v3' }).request({
			Locale,
			SenderName,
			Sender: SenderName,
			SenderEmail,
			Subject,
			ContactsListID,
			Title,
		});
		try {
			// enlazar contacto con una lista
			await mailjet
				.post('campaigndraft', { version: 'v3' })
				.id(Data[0].ID)
				.action('detailcontent')
				.request({
					Headers,
					'Html-part': HtmlPart,
					MJMLContent,
					'Text-part': TextPart,
				});
		} catch (error: any) {
			console.error('error contact post list:', error.message);
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Borrador creado pero hubo un error al crear la plantilla',
			});
		}
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Campaña creada.',
		});
	} catch (error: any) {
		console.error('error contact post:', error.message);
		// email ya existe.
		if (error.message.includes('already exists')) {
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'la campaña ya existe.',
			});
		} else if (error.message.includes('Object properties invalid')) {
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'verifique que los campos del body sean correctos.',
			});
		} else {
			// error del servidor.
			return res.status(500).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error al intentar crear la campaña.',
			});
		}
	}
};

// controller put
export const put = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	try {
		const getDraft = await controllerGetDraft(req, res);
		await controllerPutDraft(req, res, getDraft);
		await controllerPutDraftTemplate(req, res, getDraft); // en el put draft le paso la data del draft
		return res.status(200).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Datos actualizados.',
		});
	} catch (error: any) {
		console.error('error');
		return res.status(500).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Error al intentar actualizar.',
		});
	}
};

// controller delete
export const delet = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	draft_ID: string
) => {
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.put('campaigndraft', { version: 'v3' })
			.id(draft_ID)
			.request({
				Status: '-2',
			});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'draft eliminado.',
		});
	} catch (error: any) {
		// Cuando el id es incorrecto
		console.error('error contact: Controller delete', error.message);
		if (error.message.includes('404 Object not found')) {
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error en la petición por favor verifique el ID del contacto.',
			});
		} else if (error.message.includes('400 Invalid status transition')) {
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'El draft ha sido eliminado',
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
