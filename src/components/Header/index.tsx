import { FunctionComponent } from 'react';
import { signOut } from 'next-auth/client';
import Image from 'next/image';
import styles from './index.module.scss';

const Header: FunctionComponent<{
	collapseSidebar: boolean;
}> = ({ collapseSidebar }) => {
	return (
		<header
			className={`${styles.header} ${
				collapseSidebar ? `${styles.header_expanded}` : ''
			} `}
		>
			<div className={styles.header__content}>
				<form className={styles.header__content__search_form}>
					<div className={styles.header__content__search_form__input_group}>
						<div
							className={styles.header__content__search_form__input_group__text}
						>
							<Image
								src={'/images/icon-lupa.svg'}
								alt='logo masser'
								width='20'
								height='20'
							/>
						</div>
						<input
							type='text'
							className={styles.form_control}
							id='navbarForm'
							placeholder='Buscar contácto'
						/>
					</div>
				</form>
				<ul className={styles.header__nav}>
					<li>
						<a onClick={() => signOut()}>Cerrar Sesión</a>
					</li>
				</ul>
			</div>
		</header>
	);
};

export default Header;
