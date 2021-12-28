import type { NextPage } from 'next';
//import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import submitForm from '../../../hooks/createCampaign';
import dynamic from 'next/dynamic';

import Layout from '../../../components/Layout';
import styles from './index.module.scss';
import { useSession } from 'next-auth/client';

import AccesDenied from '../../../components/Login/AccessDenied';

const CodeMirror = dynamic(
	() => {
		import('codemirror/mode/javascript/javascript');
		import('codemirror/mode/xml/xml');
		import('codemirror/mode/css/css');
		import('codemirror/theme/lucario.css');
		return import('react-codemirror');
	},
	{ ssr: false }
);

const Index: NextPage = ({}) => {
	const [dataCode, setDataCode] = useState();
	const [previewCode, setPreviewCode] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (formInformation: any) => {
		submitForm(formInformation, dataCode);
	};
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [session, loading] = useSession();

	if (loading) {
		return null;
	}

	if (session == null) {
		return <AccesDenied />;
	}
	const preview = () => {
		setPreviewCode(true);
	};

	return (
		<Layout router={router}>
			<div className={styles.add_campaign}>
				<div className={styles.add_campaign__header}>
					<h2>Crear Campaña</h2>
				</div>
				<div className={styles.add_campaign__body}>
					<div className={styles.add_campaign__body__d_flex}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className='card_form'>
								<div className='card_formInput'>
									<label htmlFor='titleCampaign'>Titulo de la campaña</label>
									<input
										type='text'
										id='titleCampaign'
										name='SenderName'
										placeholder='Escriba el nombre de la campañá'
										{...register('SenderName', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
									{errors.SenderName && (
										<small className='error'>{errors.SenderName.message}</small>
									)}
								</div>
								<div className='card_formInput'>
									<label htmlFor='subject'>Asunto del mensaje</label>
									<input
										type='text'
										id='subject'
										placeholder='Escriba el asunto'
										name='Subject'
										{...register('Subject', {
											required: {
												value: true,
												message: 'Este campo es requerido',
											},
										})}
									/>
									{errors.Subject && (
										<small className='error'>{errors.Subject.message}</small>
									)}
								</div>
								<div className='card_formInput'>
									<label htmlFor='Email'>Remitente</label>
									<input
										type='text'
										id='Email'
										placeholder='test@marketing.masser.com.co'
										name='SenderEmail'
										{...register('SenderEmail', {
											required: 'Campo obligatorio',
											pattern: {
												value:
													/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
												message: 'Email inválido',
											},
										})}
									/>
									{errors.SenderEmail && (
										<small className='error'>
											{errors.SenderEmail.message}
										</small>
									)}
								</div>
							</div>
							<div className='card_form'>
								<h3 className={styles.titleh3}>HTML del mensaje </h3>
								{
									<CodeMirror
										value={dataCode}
										name='Devlog'
										options={{
											theme: 'lucario',
											lineNumbers: true,
											mode: 'xml',
										}}
										onChange={(dataCode) => {
											setDataCode(dataCode);
											setPreviewCode(false);
										}}
									/>
								}
								<div className={styles.button_preview}>
									<a className='button-link' onClick={preview}>
										Previsualizar
									</a>
								</div>
								{previewCode && (
									<>
										<small>
											<strong>Vista Previa</strong>
										</small>
										<div className={styles.result}>
											<div dangerouslySetInnerHTML={{ __html: dataCode }} />
										</div>
									</>
								)}

								<div className={`card_formButtons ${styles.align_end}`}>
									<button type='submit' className='button-green'>
										Guardar Campaña
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
/* export const getServerSideProps: GetServerSideProps = async () => {
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
}; */
export default Index;
