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
// verificar que el Name sea de tipo string y que no venga vacio.
export const controllerGetDraft = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const { draft_ID = 0 } = req.query;
	try {
		// desestructuración
		const {
			body: { Data, Total },
		} = await mailjet
			.get('campaigndraft', { version: 'v3' })
			.id(draft_ID)
			.request();
		return Data;
	} catch (error: any) {
		console.error('error al consultar usuario:', error.message);
		if (error.message.includes('404 Object not found')) {
			// cuando el id es incorrecto
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

export const controllerPutDraft = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	data
) => {
	const { draft_ID = '' } = req.query;
	let {
		Locale = '',
		SenderName = '',
		SenderEmail = '',
		Subject = '',
		Title = '',
		ContactsListID = 0,
	} = req.body;
	if (Locale === '') Locale = data[0].Locale; // si locale es igual de vacio quiere decir que no se envió datos
	if (SenderName === '') SenderName = data[0].SenderName;
	if (Subject === '') Subject = data[0].Subject;
	if (SenderEmail === '') SenderEmail = data[0].SenderEmail;
	if (Title === '') Title = data[0].Title;
	if (ContactsListID === 0) ContactsListID = data[0].ContactsListID;
	// desestructuración
	try {
		const {
			body: { Data },
		} = await mailjet
			.put('campaigndraft', { version: 'v3' })
			.id(draft_ID)
			.request({
				Locale,
				Sender: SenderName,
				SenderName,
				SenderEmail,
				Subject,
				ContactsListID,
				Title,
			});
		return Data;
	} catch (error: any) {
		// error del servidor.
		console.error(error.message);
		if (error.message === 'Unsuccessful: 304 Not Modified') return true;
		return res.status(500).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: '2Error al intentar crear la campaña.',
		});
	}
};

export const controllerPutDraftTemplate = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>,
	dataDraft: any
) => {
	let { Headers, HtmlPart, MJMLContent, TextPart } = req.body;
	if (Headers === '') Headers = dataDraft[0].Locale; // si locale es igual de vacio quiere decir que no se envió datos
	if (HtmlPart === '') HtmlPart = dataDraft[0].HtmlPart;
	if (MJMLContent === '') MJMLContent = dataDraft[0].MJMLContent;
	if (TextPart === '') TextPart = dataDraft[0].TextPart;
	console.log(dataDraft[0].ID);
	try {
		// enlazar contacto con una lista
		const {
			body: { Data, Total },
		} = await mailjet
			.post('campaigndraft', { version: 'v3' })
			.id(dataDraft[0].ID)
			.action('detailcontent')
			.request({
				Headers,
				'Html-part': HtmlPart,
				MJMLContent,
				'Text-part': TextPart,
			});
		return true;
	} catch (error: any) {
		console.error('error contact post list:', error.message);
		return res.status(400).json({
			Data: [],
			Total: null,
			TotalAll: null,
			Message: 'Borrador actualizado pero hubo un error al crear la plantilla',
		});
	}
};
