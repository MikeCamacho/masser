import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import styles from './index.module.scss';
import UploadCsv from '../../../components/UploadCsv';

const Index: NextPage = () => {
	const router = useRouter();
	const ListIdCampaign = router.query.ListIdCampaign
		? router.query.ListIdCampaign
		: '';
	return (
		<Layout router={router}>
			<div className={styles.add_contact}>
				<div className={styles.add_contact__header}>
					<h2>Cargar Contáctos</h2>
				</div>
				<div className={styles.add_contact__body}>
					<div className='card_form'>
						<label>Cargue su lista de contactos desde un archivo .csv</label>
						<UploadCsv listID={ListIdCampaign} />
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Index;
