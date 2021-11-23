import type { NextApiRequest, NextApiResponse } from 'next';
// declarando el tipo de valor del json a enviar al front
type Data = {
	msg: string;
};
// verificar que el el nombre y correo sean validos-
export const isValidBody = (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { Name = '', Email = '', ListID = '' } = req.body;
	const text = new RegExp('^[a-zA-Z ]+$'); // valida solo texto.
	const email = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/; // valida email.
	const number = /^([0-9])*$/; // valida number.
	if (!text.test(Name) || Name.trim().length <= 0) {
		res.status(400).json({
			msg: 'El nombre debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (!email.test(Email) || Email.trim().length <= 0) {
		res.status(400).json({
			msg: 'El correo electrónico debe de ser de tipo email y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else if (!number.test(ListID) || String(ListID).trim().length <= 0) {
		res.status(400).json({
			msg: 'El ID de la lista debe de ser de tipo number y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};

export const isValidId = (
	req: NextApiRequest,
	res: NextApiResponse,
	contact_ID: string
) => {
	if (contact_ID.trim().length <= 0) {
		res.status(400).json({
			msg: 'El contact ID no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};
