import { FunctionComponent } from 'react';
import { signIn } from 'next-auth/client';
import Image from 'next/image';
import styles from './index.module.scss';

const AccesDenied: FunctionComponent = () => {
	return (
		<div className={styles.login}>
			<Image
				src={`/images/masser-logo.png`}
				alt='logo masser'
				width='133'
				height='86'
			/>
			<p>¡Epa! Acceso Denegado</p>
			<button onClick={() => signIn()}>Iniciar Sesión</button>
		</div>
	);
};

export default AccesDenied;
