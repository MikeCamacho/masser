import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Error from 'next/error';
import Layout from '../../../components/Layout';
import styles from './index.module.scss';
import { useSession } from 'next-auth/client';
import deleteCampaign from '../../../hooks/deleteCampaign';

import AccesDenied from '../../../components/Login/AccessDenied';

const Index: NextPage<{ data: any; status: number }> = ({ data, status }) => {
	if (status !== 201 || Object.keys(data).length === 0) {
		return <Error statusCode={500} title={'Error de servidor'} />;
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { Data } = data;
	console.log(Data);
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [session, loading] = useSession();

	if (loading) {
		return null;
	}

	if (session == null) {
		return <AccesDenied />;
	}
	const handleDelete = () => {
		let ID = Data[0].ID;
		deleteCampaign(ID);
	};
	return (
		<Layout router={router}>
			<div className={styles.detail_campaign}>
				<div className={styles.detail_campaign__header}>
					<h2>Detalles de la campaña</h2>
					<div className={styles.detail_campaign__headerButtons}>
						<button
							className='button-green'
							/* onClick={() => {
								router.push({
									pathname: '/contactos/crear-contacto',
									query: {
										ListIdCampaign: ListIdCampaign,
									},
								});
							}} */
						>
							Editar
						</button>
						<button
							className='button-red'
							onClick={handleDelete}
							/* onClick={() => {
								router.push({
									pathname: '/contactos/cargar-contactos',
									query: {
										ListIdCampaign: ListIdCampaign,
									},
								});
							}} */
						>
							Eliminar
						</button>
					</div>
				</div>
				<div className={styles.detail_campaign__body}>
					<div className={styles.detail_campaign__body__d_flex}>
						<div className='card_form'>
							<div className={styles.detail_campaign__body__group}>
								<h3>Titulo de la campaña</h3>
								<p>{Data[0].Title}</p>
							</div>
							<div className={styles.detail_campaign__body__group}>
								<h3>Asunto del mensaje</h3>
								<p>{Data[0].Subject}</p>
							</div>
							<div className={styles.detail_campaign__body__group}>
								<h3>Lista de contactos enviada</h3>
								<p>{Data[0].ContactsListID}</p>
							</div>
							<div className={styles.detail_campaign__body__group}>
								<h3>Fecha de creación</h3>
								<p>{Data[0].CreatedAt}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const ListIdCampaign = query.ListIdCampaign;
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/campaigns/drafts?draft_ID=${ListIdCampaign}`
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
