import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import styles from './index.module.scss';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import AccesDenied from '../../../components/Login/AccessDenied';

const Index: NextPage<{ data: any; status: number }> = ({ data, status }) => {
	if (status !== 201 || Object.keys(data).length === 0) {
		return <Error statusCode={500} title={'Error de servidor'} />;
	}

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();
	const { Data } = data;
	console.log(Data);

	// Validate session ?
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [session, loading] = useSession();

	if (loading) {
		return null;
	}

	if (session == null) {
		return <AccesDenied />;
	}
	return (
		<Layout router={router}>
			<div className={styles.view_list_contacts}>
				<div className={styles.view_list_contacts__header}>
					<h2>Listas de contactos</h2>

					<button
						className='button-green'
						onClick={() => {
							router.push({
								pathname: '/contactos/lista-de-contactos/crear-lista',
							});
						}}
					>
						CREAR LISTA
					</button>
				</div>
				<div className={`card-body ${styles.view_list_contacts__body}`}>
					<table>
						<thead>
							<tr>
								<th>Titulo</th>
								<th>FECHA CREACIóN</th>
								<th>CONTACTOS</th>
								<th>ID</th>
								<th>Accion</th>
							</tr>
						</thead>
						<tbody>
							{Data.map((item: any, index: number) => (
								<tr key={index}>
									<td>{item.Name}</td>
									<td>{item.CreatedAt}</td>
									<td>{item.SubscriberCount}</td>
									<td>{item.ID}</td>
									<td>
										<button
											type='button'
											onClick={() => {
												router.push({
													pathname:
														'/contactos/lista-de-contactos/detalle-de-lista',
													query: {
														ListIdCampaign: item.ID,
														NameCampaign: item.Name,
														NumberOfContacts: item.SubscriberCount,
													},
												});
											}}
										>
											Gestionar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps<{}> = async () => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contact-lists`
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
