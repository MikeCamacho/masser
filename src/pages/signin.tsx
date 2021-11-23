import { getCsrfToken } from 'next-auth/client';
import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';
import styles from './SignIn.module.scss';
import Image from 'next/image';

const SignIn: FunctionComponent<{ csrfToken: any }> = ({ csrfToken }) => {
	return (
		<div className={styles.form_login}>
			<Image
				src={`/images/logo.svg`}
				alt='logo masser'
				width='300'
				height='86'
			/>
			<form method='post' action='/api/auth/callback/credentials'>
				<div className='card_form'>
					<div className='card_formInput'>
						<input name='csrfToken' type='hidden' defaultValue={csrfToken} />
						<label>Email</label>
						<input name='email' type='email' />
					</div>
					<div className='card_formInput'>
						<label>Contraseña</label>
						<input name='password' type='password' />
					</div>
					<button type='submit' className='button-green'>
						INGRESAR
					</button>
				</div>
			</form>
		</div>
	);
};

export default SignIn;
// This is the recommended way for Next.js 9.3 or newer
export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
	return {
		props: {
			csrfToken: await getCsrfToken(context),
		},
	};
};
