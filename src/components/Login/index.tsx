import { FunctionComponent } from 'react';
import { signIn } from 'next-auth/client';
import Image from 'next/image';
import styles from './index.module.scss';

const Login: FunctionComponent = () => {
	return (
		<div className={styles.login}>
			<Image
				src={`/images/logo.svg`}
				alt='logo masser'
				width='300'
				height='86'
			/>
			<p>Bienvenido por favor inicie sesión</p>
			<button onClick={() => signIn()}>Iniciar Sesión</button>
		</div>
	);
};

export default Login;
