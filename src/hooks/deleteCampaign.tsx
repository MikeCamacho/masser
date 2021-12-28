import Swal from 'sweetalert2';

const createContactForm = async (ID: any) => {
	var raw = '';
	const requestOptions = {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
		body: raw,
	};
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/campaigns/drafts?draft_ID=${ID}`,
			requestOptions
		);
		console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Campaña Borrada',
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
