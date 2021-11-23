import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Error from 'next/error';
import Layout from '../components/Layout';
import styles from './Dashboard.module.scss';

import { useSession } from 'next-auth/client';

import Login from '../components/Login';
import { Key } from 'react';

const Dashboard: NextPage<{ data: any; status: number }> = ({
	data,
	status,
}) => {
	if (status !== 201 || Object.keys(data).length === 0) {
		return <Error statusCode={500} title={'Error de servidor'} />;
	}
	const { Data } = data;

	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [session, loading] = useSession();

	if (loading) {
		return null;
	}

	if (session == null) {
		return <Login />;
	}

	return (
		<Layout>
			<div className={styles.content}>
				<div className={styles.last_messages_sent}>
					<h2>Últimos mensajes enviados </h2>
					<div className={`card-body ${styles.last_messages_sent__projects}`}>
						<h3>Projects</h3>
						<table>
							<thead>
								<tr>
									<th>ASUNTO</th>
									<th>FECHA</th>
								</tr>
							</thead>
							<tbody>
								{Data.map(
									(
										item: {
											FromName: string;
											CreatedAt: string;
										},
										index: Key | null | undefined
									) => (
										<tr key={index}>
											<td>{item.FromName}</td>
											<td>{item.CreatedAt}</td>
											{/* 
										<td className={`${item.state.toLocaleLowerCase()}`}>
											<span>{item.state}</span>
										</td>
										<td>{item.asunto}</td> */}
										</tr>
									)
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/campaigns/sent?Email=${process.env.NEXT_PUBLIC_EMAIL}`
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
export default Dashboard;
