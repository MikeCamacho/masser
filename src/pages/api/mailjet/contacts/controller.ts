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
			.get('contact', { version: 'v3' })
			.request({ countOnly: 1 });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('contact', { version: 'v3' }).request({
			Offset,
			Limit,
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: TotalAll.body.Total,
			Message: 'Petición exitosa.',
		});
	} catch (error) {
		console.error('error contact-controller getAll:', error);
		res.status(500).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Error en la petición intente mas tarde.',
		});
	}
};

// controller getList
export const getList = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { ContactsList = '', Offset = 0, Limit = 10 } = req.query;

	// traer todo las listas.
	try {
		const TotalAll = await mailjet
			.get('contact', { version: 'v3' })
			.request({ ContactsList, countOnly: 1 });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('contact', { version: 'v3' }).request({
			ContactsList,
			Offset,
			Limit,
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: TotalAll.body.Total,
			Message: 'Petición exitosa.',
		});
	} catch (error: any) {
		console.error('error contactList get id:', error);
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

// controller get
export const get = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { contact_ID = '' } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('contact', { version: 'v3' })
			.id(contact_ID)
			.request();

		try {
			const properties = await mailjet
				.get('contactdata', { version: 'v3' })
				.id(contact_ID)
				.request();
			return res.status(201).json({
				Data,
				properties: properties.body.Data,
				Total,
				TotalAll: null,
				Message: 'Petición exitosa.',
			});
		} catch (error) {
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error en la petición de las propiedades.',
			});
		}
	} catch (error: any) {
		console.error('error contact get id:', error);
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

// controller post
export const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { Name = '', Email = '', ListID = '' } = req.body;
	try {
		// desestructuración.

		// crear el contacto
		const {
			body: { Data, Total },
		} = await mailjet.post('contact', { version: 'v3' }).request({
			IsExcludedFromCampaigns: 'false',
			Name,
			Email,
		});

		try {
			// enlazar contacto con una lista
			await mailjet.post('listrecipient', { version: 'v3' }).request({
				IsUnsubscribed: 'true',
				ContactID: Data[0].ID,
				ListID,
			});
		} catch (error: any) {
			console.error('error contact post list:', error.message);
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Por favor verifique el ID de la lista.',
			});
		}
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'contacto creado.',
		});
	} catch (error: any) {
		console.error('error contact post:', error.message);
		// email ya existe.
		if (error.message.includes('already exists')) {
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'El email ya existe.',
			});
		} else {
			// error del servidor.
			return res.status(500).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error al intentar crear un contacto.',
			});
		}
	}
};

// controller put
export const put = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { Name = '', Email } = req.body;
	const { contact_ID = '0' } = req.query;
	try {
		// desestructuración.
		const {
			body: { Data, Total },
		} = await mailjet.put('contact', { version: 'v3' }).id(contact_ID).request({
			Name,
			Email,
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Lista actualizada.',
		});
	} catch (error: any) {
		// Cuando el id es incorrecto
		console.error('error contact: Controller Put', error.message);
		if (error.message.includes('404 Object not found')) {
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

// controller delete
export const delet = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { contact_ID = '0' } = req.query;
	try {
		// desestructuración.
		const {
			body: { Data, Total },
		} = await mailjet
			.delete('contact', { version: 'v4' })
			.id(contact_ID)
			.request();
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'contacto eliminado',
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
