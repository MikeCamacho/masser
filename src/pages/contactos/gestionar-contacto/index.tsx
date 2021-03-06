import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import Layout from '../../../components/Layout';
import styles from './index.module.scss';
import { useSession } from 'next-auth/client';
import deleteContact from '../../../hooks/deleteContactID';
import { useRouter } from 'next/router';
import AccesDenied from '../../../components/Login/AccessDenied';

const Index: NextPage<{ data: any; status: number }> = ({ data, status }) => {
	if (status !== 201 || Object.keys(data).length === 0) {
		return <Error statusCode={500} title={'Error de servidor'} />;
	}

	const Properties = data.properties[0].Data;
	const { Data } = data;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();
	const {
		query: { ListIdCampaign, NameCampaign, NumberOfContacts },
	} = router;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [session, loading] = useSession();

	if (loading) {
		return null;
	}

	if (session == null) {
		return <AccesDenied />;
	}
	let datos: any = '';

	const handleDelete = () => {
		datos = [
			{
				Email: `${Data[0].Email}`,
				IsExcludedFromCampaigns: 'true',
				Name: `${Data[0].Name}`,
				Ciudad: `${Properties[1].Value}`,
				apellido: `${Properties[0].Value}`,
				estacion: `${Properties[3].Value}`,
				telefono: `${Properties[2].Value}`,
				tipo_vehiculo: `${Properties[4].Value}`,
			},
		];

		deleteContact(datos, ListIdCampaign, NameCampaign, NumberOfContacts);
	};

	return (
		<Layout router={router}>
			<div className={styles.detail_contact}>
				<div className={styles.detail_contact__header}>
					<h2>Detalles del contacto</h2>
					<div className={styles.detail_contact__headerButtons}>
						<button
							className='button-green'
							onClick={() => {
								router.push({
									pathname: '/contactos/editar',
									query: {
										Id: Data[0].ID,
										ListIdCampaign: ListIdCampaign,
									},
								});
							}}
						>
							Editar Contacto
						</button>
						<button className='button-red' onClick={handleDelete}>
							Eliminar
						</button>
					</div>
				</div>
				<div className={styles.detail_contact__body}>
					<div className={styles.detail_contact__body__d_flex}>
						<div className='card_form'>
							<div className={styles.detail_contact__body__group}>
								<h3>Nombre</h3>
								<p>{Data[0].Name}</p>
							</div>
							<div className={styles.detail_contact__body__group}>
								<h3>Apellidos:</h3>
								<p>{Properties[0].Value}</p>
							</div>
							<div className={styles.detail_contact__body__group}>
								<h3>Correo</h3>
								<p>{Data[0].Email}</p>
							</div>
							<div className={styles.detail_contact__body__group}>
								<h3>Celular:</h3>
								<p>{Properties[2].Value}</p>
							</div>
						</div>
						<div className='card_form'>
							<div className={styles.detail_contact__body__group}>
								<h3>Ciudad:</h3>
								<p>{Properties[1].Value}</p>
							</div>
							<div className={styles.detail_contact__body__group}>
								<h3>Estaci??n de servicio ETS:</h3>
								<p>{Properties[3].Value}</p>
							</div>
							<div className={styles.detail_contact__body__group}>
								<h3>Tipo de Veh??culo</h3>
								<p>{Properties[4].Value}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const ID = query.ID;
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contacts?contact_ID=${ID}`
		);
		const data = await res.json();

		return {
			props: {
				data,
				status: res.status,
			},
		};
	} catch (error) {
		return {
			props: {
				data: [],
				status: 500,
			},
		};
	}
};
export default Index;
