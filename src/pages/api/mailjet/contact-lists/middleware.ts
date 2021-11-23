import type { NextApiRequest, NextApiResponse } from 'next';
// declarando el tipo de valor del json a enviar al front
type Data = {
	msg: string;
};
// verificar que el Name sea de tipo string y que no venga vacio.
export const isValidName = (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	Name: string
) => {
	if (typeof Name !== 'string' || Name.trim().length <= 0) {
		res.status(400).json({
			msg: 'El nombre debe de ser de tipo string y no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};

export const isValidId = (
	req: NextApiRequest,
	res: NextApiResponse,
	list_ID: string
) => {
	if (list_ID.trim().length <= 0) {
		res.status(400).json({
			msg: 'El list_ID no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};
