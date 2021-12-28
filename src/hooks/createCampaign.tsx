import Swal from 'sweetalert2';

const createContactForm = async (formInformation: any, dataCode: any) => {
	const data = {
		...formInformation,
	};

	var raw = JSON.stringify({
		Locale: 'es_ES',
		SenderEmail: `${data.SenderEmail}`,
		SenderName: `${data.SenderName}`,
		Subject: `${data.Subject}`,
		ContactsListID: 68562,
		Title: `${data.SenderName}`,
		Headers: 'object',
		HtmlPart: `${dataCode}`,
		MJMLContent: '',
		'Text-part':
			'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
	});
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: raw,
	};
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/campaigns/drafts`,
			requestOptions
		);
		console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Campaña creada',
				showConfirmButton: true,
			}).then(() => {
				window.location.href = '/campaigns';
			});
		} else {
			console.log('Error inesperado intente nuevamente');
			Swal.fire({
				icon: 'error',
				title: 'Error inesperado intente nuevamente',
				showConfirmButton: true,
			});
		}
	} catch (error) {
		console.log('Error inesperado');
	}
};
export default createContactForm;
