import Swal from 'sweetalert2';

const createContactMultiple = async (datos: any, ListIdCampaign: number) => {
	/* const data = {
    ...datos,
  }; */

	var raw: any = `[${datos.map(
		(item: {
			Email: string;
			IsExcludedFromCampaigns: string;
			Properties: any;
			Name: string;
			ciudad: string;
			apellido: string;
			estacion: string;
			telefono: string;
			tipo_vehiculo: string;
		}) => [
			`{"Email":"${item.Email}","IsExcludedFromCampaigns":"${item.IsExcludedFromCampaigns}","Name":"${item.Name}", "Properties": {"Ciudad":"${item.Properties.Ciudad}", "telefono":"${item.Properties.telefono}", "apellido":"${item.Properties.apellido}", "estacion":"${item.Properties.estacion}", "tipo_vehiculo":"${item.Properties.tipo_vehiculo}"}}`,
		]
	)}]`;

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
		//console.log(response);
		if (response.ok && response.status === 201) {
			Swal.fire({
				icon: 'success',
				title: 'Archivo cargado con exito',
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
export default createContactMultiple;
