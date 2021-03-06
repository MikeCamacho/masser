import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import styles from './index.module.scss';
import Layout from '../../../../components/Layout';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import React from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import AccesDenied from '../../../../components/Login/AccessDenied';
const Index: NextPage<{ data: any; status: number }> = ({ data, status }) => {
	if (status !== 201 || Object.keys(data).length === 0) {
		return <Error statusCode={500} title={'Error de servidor'} />;
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const router = useRouter();
	const {
		query: { ListIdCampaign, NameCampaign, NumberOfContacts },
	} = router;

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

	return (
		<Layout router={router}>
			<div className={styles.view_detail_campaign}>
				<div className={styles.view_detail_campaign__header}>
					<h2>Listas de contactos</h2>
					<div className={styles.view_detail_campaign__headerButtons}>
						<button
							className='button-green'
							onClick={() => {
								router.push({
									pathname: '/contactos/crear-contacto',
									query: {
										ListIdCampaign: ListIdCampaign,
									},
								});
							}}
						>
							Añadir Contacto
						</button>
						<button
							className='button-green'
							onClick={() => {
								router.push({
									pathname: '/contactos/cargar-contactos',
									query: {
										ListIdCampaign: ListIdCampaign,
									},
								});
							}}
						>
							Importar
						</button>
					</div>
				</div>
				<div className={styles.view_detail_campaign__subheader}>
					<h2>{NameCampaign}</h2>
					<p>
						<span>{NumberOfContacts} - Contactos</span>

						<ReactHTMLTableToExcel
							id='btn-export-excel'
							className='download-table-xls-button'
							table='list-contact'
							filename={NameCampaign}
							sheet='Pagina 1'
							buttonText='Exportar Lista'
						/>
					</p>
				</div>
				<div className={`card-body ${styles.view_detail_campaign__body}`}>
					<table id='list-contact'>
						<thead>
							<tr>
								<th>Correo</th>
								<th>Añadido</th>
								<th>Acción</th>
							</tr>
						</thead>
						<tbody>
							{Data.map((item: any, index: number) => {
								return item.IsExcludedFromCampaigns === false ? (
									<tr key={index}>
										<td>{item.Email}</td>
										<td>{item.CreatedAt}</td>
										<td>
											<button
												type='button'
												onClick={() => {
													router.push({
														pathname: '/contactos/gestionar-contacto',
														query: {
															ID: item.ID,
															ListIdCampaign: ListIdCampaign,
															NameCampaign: NameCampaign,
															NumberOfContacts: NumberOfContacts,
														},
													});
												}}
											>
												Gestionar
											</button>
										</td>
									</tr>
								) : (
									<tr></tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const ListIdCampaign = query.ListIdCampaign;
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contacts?Email=${process.env.NEXT_PUBLIC_EMAIL}&ContactsList=${ListIdCampaign}&Offset=0&Limit=10`
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
