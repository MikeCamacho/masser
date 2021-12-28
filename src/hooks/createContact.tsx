import Swal from 'sweetalert2';

const createContactForm = async (formInformation: any, ListIdCampaign: any) => {
	const data = {
		...formInformation,
	};

	var raw = `[{"Email":"${data.Email}","IsExcludedFromCampaigns":"false","Name":"${data.Name}", "Properties": {"Ciudad":"${data.ciudad}", "apellido":"${data.apellido}", "estacion":"${data.estacion}", "telefono":"${data.telefono}", "tipo_vehiculo": "${data.tipo_vehiculo}" }}]`;
	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
		},
		body: raw,
	};
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contact-multiple?list_ID=${ListIdCampaign}`,
			requestOptions
		);
		console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Contacto Guardado',
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
export default createContactForm;
