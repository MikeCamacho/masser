import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import submitForm from '../../../hooks/createContact';

import Layout from '../../../components/Layout';
import styles from './index.module.scss';
import { useSession } from 'next-auth/client';

import AccesDenied from '../../../components/Login/AccessDenied';

const Index: NextPage = ({}) => {
	const router = useRouter();
	const {
		query: { ListIdCampaign },
	} = router;

	const {
		register,
		handleSubmit,
		//formState: { errors },
	} = useForm();

	const onSubmit = (formInformation: any) => {
		submitForm(formInformation, ListIdCampaign);
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
		<Layout>
			<div className={styles.add_contact}>
				<div className={styles.add_contact__header}>
					<h2>Añadir Contácto</h2>
				</div>
				<div className={styles.add_contact__body}>
					<div className={styles.add_contact__body__d_flex}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='card_form'>
								<div className='card_formInput'>
									<label htmlFor='fullName'>Nombres</label>
									<input
										type='text'
										id='fullName'
										name='Name'
										placeholder='Nombres'
										{...register('Name', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
								</div>
								<div className='card_formInput'>
									<label htmlFor='LastName'>Apellidos</label>
									<input
										type='text'
										id='LastName'
										placeholder='Apellidos'
										name='apellido'
										{...register('apellido', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
								</div>
								<div className='card_formInput'>
									<label htmlFor='Email'>E-mail*</label>
									<input
										type='text'
										id='Email'
										placeholder='E-mail'
										name='Email'
										{...register('Email', {
											required: 'Campo obligatorio',
											pattern: {
												value:
													/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
												message: 'Email inválido',
											},
										})}
									/>
								</div>
								<div className='card_formInput'>
									<label htmlFor='numberIdentification'>Celular</label>
									<input
										type='number'
										id='numberIdentification'
										placeholder='+573015155101'
										name='telefono'
										{...register('telefono', {
											/* required: {
												value: true,
												message: 'Este campo es requerido',
											},

											maxLength: {
												value: 13,
												message: 'El número excede la longitud',
											},
											minLength: {
												value: 13,
												message: 'El número es muy corto',
											}, */
										})}
									/>
								</div>
							</div>
							<div className='card_form'>
								<div className='card_formInput'>
									<label htmlFor='City'>Ciudad</label>
									<input
										type='text'
										id='City'
										name='ciudad'
										placeholder='Ciudad'
										{...register('ciudad', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
								</div>
								<div className='card_formInput'>
									<label htmlFor='Eds'>Estación de servicio ETS</label>
									<input
										type='text'
										id='Eds'
										name='estacion'
										placeholder='Álamos Carrefour'
										{...register('estacion', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
								</div>
								<div className='card_formInput'>
									<label htmlFor='typeVehicle'>Tipo de Vehículo </label>
									<input
										type='text'
										id='typeVehicle'
										name='tipo_vehiculo'
										placeholder='Automóvil Liviano'
										{...register('tipo_vehiculo', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
								</div>
								<div className='card_formButtons'>
									<button type='submit' className='button-green'>
										Guardar Contacto
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_BACKEND}/mailjet/contact-lists?Email=${process.env.NEXT_PUBLIC_EMAIL}&Offset=0&Limit=10`
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
