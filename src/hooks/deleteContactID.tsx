import Swal from 'sweetalert2';

const deleteContactForm = async (datos: any, dataID: number) => {
	const data = {
		...datos,
	};

	//var raw = `[{"Email":"${data[0].Email}","IsExcludedFromCampaigns":"${data[0].IsExcludedFromCampaigns}","Name":"${data[0].Name}", "Properties": {"Ciudad":"${data[0].ciudad}", "apellido":"${data[0].apellido}", "estacion":"${data[0].estacion}", "telefono":"${data[0].telefono}", "tipo_vehiculo": "${data[0].tipo_vehiculo}" }}]`;

	var raw = `[{"Email":"${data.Email}","IsExcludedFromCampaigns":"true","Name":"${data.Name}", "Properties": {"Ciudad":"${data.ciudad}", "apellido":"${data.apellido}", "estacion":"${data.estacion}", "telefono":"${data.telefono}", "tipo_vehiculo": "${data.tipo_vehiculo}" }}]`;

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'text/plain',
		},
		body: raw,
	};
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contact-multiple?list_ID=${dataID}`,
			requestOptions
		);
		console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Contacto Eliminado',
				showConfirmButton: true,
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
