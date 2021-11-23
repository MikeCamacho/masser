import type { NextApiRequest, NextApiResponse } from 'next';
// declarando el tipo de valor del json a enviar al front
type Data = {
	message: string | never;
};
export const isValidDraftId = (
	req: NextApiRequest,
	res: NextApiResponse,
	draft_ID: string
) => {
	if (String(draft_ID).trim().length <= 0) {
		res.status(400).json({
			msg: 'El draft_ID no puede estar vacio.',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};

export const isValidAction = (
	req: NextApiRequest,
	res: NextApiResponse,
	action: string
) => {
	if (action.trim().length <= 0) {
		res.status(400).json({
			msg: 'La action no puede estar vacia.',
		});
		return false; // no debe continuar.
	} else if (
		action.toLocaleLowerCase() !== 'test' &&
		action.toLocaleLowerCase() !== 'send'
	) {
		res.status(400).json({
			msg: 'La acciones solo pueden ser: (test o send)',
		});
		return false; // no debe continuar.
	} else return true; // puede continuar.
};
