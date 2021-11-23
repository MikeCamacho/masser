// Initial mailjet
const mailjet = require('node-mailjet').connect(
	process.env.MJ_APIKEY_PUBLIC,
	process.env.MJ_APIKEY_PRIVATE
);
import type { NextApiRequest, NextApiResponse } from 'next';
// declarando el tipo de valor del json a enviar al front
type Data = {
	message: string | never;
};
// verificar que el Name sea de tipo string y que no venga vacio.
export const isValidBody = (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		Locale = '',
		SenderName = '',
		SenderEmail = '',
		Subject = '',
		Title = '',
		ContactsListID = '',
	} = req.body;
	const number = /^([0-9])*$/; // valida number.
	const email = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/; // valida email.
	if (typeof Locale !== 'string' || Locale.trim().length <= 0) {
		res.status(400).json({
			message:
				'El campo Locale debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (typeof SenderName !== 'string' || SenderName.trim().length <= 0) {
		res.status(400).json({
			message:
				'El campo SenderName debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (!email.test(SenderEmail) || SenderEmail.trim().length <= 0) {
		res.status(400).json({
			message:
				'El campo SenderEmail debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (typeof Subject !== 'string' || Subject.trim().length <= 0) {
		res.status(400).json({
			message:
				'El campo Subject debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (typeof Title !== 'string' || Title.trim().length <= 0) {
		res.status(400).json({
			message:
				'El campo Title debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (
		!number.test(ContactsListID) ||
		String(ContactsListID).trim().length <= 0
	) {
		res.status(400).json({
			message:
				'El campo ContactsListID debe de ser de tipo Number y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};

// verificar que el Name sea de tipo string y que no venga vacio.
export const isValidContactList = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { ContactsListID = '' } = req.body;
	if (ContactsListID !== '') {
		try {
			// desestructuración
			await mailjet
				.get('contactslist', { version: 'v3' })
				.id(ContactsListID)
				.request();
			return true; // puede continuar
		} catch (error) {
			console.error('error middleware- campaings draft:', error);
			res.status(500).json({
				message: 'Error en la petición verifique el ID de la lista.',
			});
			return false; // no puede continuar;
		}
	} else {
		return true; // puede continuar
	}
};

// Verificar status.
export const isValidStatus = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	draft_ID
) => {
	try {
		const {
			body: { Data },
		} = await mailjet
			.get('campaigndraft', { version: 'v3' })
			.id(draft_ID)
			.request();
		if (Data[0].Status !== 0) {
			res.status(401).json({
				Data: [],
				Total: null,
				TotalAll: null,
				message: 'La campaña draft esta borrada',
			});
			return false; // no puede continuar;
		}
		return true; // puede continuar
	} catch (error) {
		console.error('error middleware- campaings draft:', error);
		res.status(500).json({
			message: 'Error en la petición.',
		});
		return false; // no puede continuar;
	}
};

export const isValidDraftId = (
	req: NextApiRequest,
	res: NextApiResponse,
	draft_ID: string
) => {
	if (draft_ID.trim().length <= 0) {
		res.status(400).json({
			msg: 'El draft_ID no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};
