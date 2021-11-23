// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	name: string;
};

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	res.status(200).json([
		{
			email: 'demo@gmail.com',
			date: '26/04/2021',
			state: 'Spam',
			asunto: 'Campaña',
		},
		{
			email: 'demo2@gmail.com',
			date: '26/04/2021',
			state: 'Abierto',
			asunto: 'Campaña2',
		},
		{
			email: 'demo3@gmail.com',
			date: '26/04/2021',
			state: 'Pendiente',
			asunto: 'Campaña3',
		},
		{
			email: 'demo4@gmail.com',
			date: '26/04/2021',
			state: 'En espera',
			asunto: 'Campaña4',
		},
		{
			email: 'demo5@gmail.com',
			date: '26/04/2021',
			state: 'Entregado',
			asunto: 'Campaña5',
		},
		{
			email: 'demo6@gmail.com',
			date: '26/04/2021',
			state: 'Bloqueado',
			asunto: 'Campaña6',
		},
	]);
}
