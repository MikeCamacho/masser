import Swal from 'sweetalert2';

const deleteContactForm = async (
	datos: any,
	ListIdCampaign: any,
	NameCampaign: any,
	NumberOfContacts: any
) => {
	const data = {
		...datos,
	};

	//var raw = `[{"Email":"${data[0].Email}","IsExcludedFromCampaigns":"${data[0].IsExcludedFromCampaigns}","Name":"${data[0].Name}", "Properties": {"Ciudad":"${data[0].ciudad}", "apellido":"${data[0].apellido}", "estacion":"${data[0].estacion}", "telefono":"${data[0].telefono}", "tipo_vehiculo": "${data[0].tipo_vehiculo}" }}]`;

	var raw = `[{"Email":"${data[0].Email}","IsExcludedFromCampaigns":"${data[0].IsExcludedFromCampaigns}","Name":"${data[0].Name}", "Properties": {"Ciudad":"${data[0].ciudad}", "apellido":"${data[0].apellido}", "estacion":"${data[0].estacion}", "telefono":"${data[0].telefono}", "tipo_vehiculo": "${data[0].tipo_vehiculo}" }}]`;

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
				title: 'Contacto Eliminado',
				showConfirmButton: true,
			}).then(() => {
				window.location.href = `/contactos/lista-de-contactos/detalle-de-lista/?ListIdCampaign=${ListIdCampaign}&NameCampaign=${NameCampaign}&NumberOfContacts=${NumberOfContacts}`;
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
export default deleteContactForm;
