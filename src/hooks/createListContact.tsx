import Swal from 'sweetalert2';

const createListContact = async (formInformation: any) => {
	const data = { ...formInformation };

	var raw = JSON.stringify({
		Name: data.Name,
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
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contact-lists`,
			requestOptions
		);
		console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Lista creada',
				showConfirmButton: true,
			}).then(() => {
				window.location.href = '/contactos/lista-de-contactos';
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

export default createListContact;
