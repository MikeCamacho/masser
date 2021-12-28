import type { NextPage } from 'next';
import { useForm } from 'react-hook-form';
import submitForm from '../../../../hooks/createListContact';
import { useRouter } from 'next/router';

import Layout from '../../../../components/Layout';
import styles from './index.module.scss';
import { useSession } from 'next-auth/client';
import AccesDenied from '../../../../components/Login/AccessDenied';

const Index: NextPage = ({}) => {
	const {
		register,
		handleSubmit,
		//formState: { errors },
	} = useForm();
	const router = useRouter();
	const onSubmit = (formInformation: any) => {
		submitForm(formInformation);
	};
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
			<div className={styles.add_list}>
				<div className={styles.add_list__header}>
					<h2>Crear una nueva lista de contactos</h2>
				</div>
				<div className={styles.add_list__body}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className='card_form'>
							<div className='card_formInput'>
								<label htmlFor='fullName'>Nombre de la lista</label>
								<input
									type='text'
									id='fullName'
									name='Name'
									placeholder='Nueva Lista'
									{...register('Name', {
										required: {
											value: true,
											message: 'Este campo es requerido',
										},
									})}
								/>
							</div>
						</div>
						<div className='card_formButtons'>
							<button type='submit' className='button-green'>
								Guardar Lista
							</button>
						</div>
					</form>
				</div>
			</div>
		</Layout>
	);
};

export default Index;
