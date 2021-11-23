import { FunctionComponent } from 'react';

import { CSVReader } from 'react-papaparse';
import submitForm from '../../hooks/createContactMultiple';

const UploadCSV: FunctionComponent<{ listID: any }> = ({ listID }) => {
	console.log(listID);
	const handleOnDrop = (data: any[]) => {
		let datos: {
			Name: any;
			Email: any;
			IsExcludedFromCampaigns: any;
			Properties: {
				apellido: any;
				telefono: any;
				Ciudad: any;
				estacion: any;
				tipo_vehiculo: any;
			};
		}[] = [];
		/* console.log('primer console');
		console.log(data);
		console.log('---------------------------'); */
		data.map((item, index) => {
			if (index > 0) {
				datos.push({
					Name: item.data[0],
					Email: item.data[2],
					IsExcludedFromCampaigns: item.data[7],
					Properties: {
						apellido: item.data[1],
						telefono: item.data[3],
						Ciudad: item.data[4],
						estacion: item.data[5],
						tipo_vehiculo: item.data[6],
					},
				});
			}
		});
		//console.log(datos);
		submitForm(datos, listID);
	};

	const handleOnError = (
		err: any /* file: any, inputElem: any, reason: any */
	) => {
		console.log(err);
	};

	const handleOnRemoveFile = (data: any) => {
		console.log(data);
	};
	return (
		<CSVReader
			onDrop={handleOnDrop}
			onError={handleOnError}
			addRemoveButton
			removeButtonColor='#659cef'
			onRemoveFile={handleOnRemoveFile}
		>
			<span>Arrastre o cargue aqui su archivo CSV</span>
		</CSVReader>
	);
};
export default UploadCSV;
