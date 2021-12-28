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
			.get('contactslist', { version: 'v3' })
			.request({ countOnly: 1 });
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.get('contactslist', { version: 'v3' }).request({
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
		console.error('error contactList-controller getAll:', error);
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
	const { list_ID = '' } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('contactslist', { version: 'v3' })
			.id(list_ID)
			.request();

		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Petición exitosa.',
		});
	} catch (error: any) {
		console.error('error contactList get id:', error.message);
		if (
			error.message.includes('Object not found') ||
			error.message.includes('Unsuccessful')
		) {
			return res.status(404).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'Error en la petición por favor verifique el ID de la lista.',
			});
		} else {
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
	const { Name = '' } = req.body;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet.post('contactslist', { version: 'v3' }).request({
			Name,
		});
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Lista creada.',
		});
	} catch (error: any) {
		console.error('error contact post:', error.message);
		// email ya existe.
		if (error.message.includes('already exists')) {
			return res.status(400).json({
				Data: [],
				Total: null,
				TotalAll: null,
				Message: 'El contacto ya existe.',
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
	const { Name = '' } = req.body;
	const { list_ID = '0' } = req.query;
	// si el nombre esta vacio no hay nada que crear.
	if (Name !== '') {
		try {
			// desestructuración
			const {
				body: { Data, Total },
			} = await mailjet
				.put('contactslist', { version: 'v3' })
				.id(list_ID)
				.request({
					Name,
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
			if (
				error.message.includes('Object not found') ||
				error.message.includes('Unsuccessful')
			) {
				return res.status(404).json({
					Data: [],
					Total: null,
					TotalAll: null,
					Message:
						'Error en la petición por favor verifique el ID del contacto.',
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
	}
};

// controller delete
export const delet = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { list_ID = '01' } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.delete('contactslist', { version: 'v3' })
			.id(list_ID)
			.request();
		return res.status(201).json({
			Data,
			Total,
			TotalAll: null,
			Message: 'Lista eliminada.',
		});
	} catch (error: any) {
		// Cuando el id es incorrecto
		console.error('error contact: Controller delete', error.message);
		if (
			error.message.includes('Object not found') ||
			error.message.includes('Unsuccessful')
		) {
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
