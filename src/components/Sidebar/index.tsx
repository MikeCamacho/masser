import React, { FunctionComponent } from 'react';
import styles from './index.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const Sidebar: FunctionComponent<{
	setCollapseSidebar: any;
	collapseSidebar: boolean;
	router: any;
}> = ({ setCollapseSidebar, collapseSidebar, router }) => {
	return (
		<>
			<nav
				className={`${styles.sidebar} ${
					collapseSidebar ? `${styles.sidebar_collapse}` : ''
				} `}
			>
				<div className={styles.sidebar__header}>
					<Link href='/'>
						<a className={styles.sidebar__brand}>
							<Image
								src={`/images/logo.svg`}
								alt='logo masser'
								width='133'
								height='38'
							/>
						</a>
					</Link>
					<div
						className={styles.sidebar__toggler}
						onClick={() => setCollapseSidebar(!collapseSidebar)}
					>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>
				<div className={styles.sidebar__body}>
					<ul className={styles.sidebar__body__nav}>
						<li
							className={`${styles.sidebar__body__nav__item} ${styles.sidebar__body__nav__category}`}
						>
							Inicio
						</li>
						<li
							className={`${styles.sidebar__body__nav__item} ${
								router.pathname == '/' ? 'active-nav' : ''
							}`}
						>
							<Link href='/'>
								<a className={styles.sidebar__body__nav__item__link}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className={styles.sidebar__body__nav__item__linkIcon}
									>
										<path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path>
										<polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline>
										<line x1='12' y1='22.08' x2='12' y2='12'></line>
									</svg>

									<span className={styles.sidebar__body__nav__item__linkTitle}>
										Dashboard
									</span>
								</a>
							</Link>
						</li>
						<li
							className={`${styles.sidebar__body__nav__item} ${styles.sidebar__body__nav__category}`}
						>
							MÓDULOS
						</li>
						<li
							className={`${styles.sidebar__body__nav__item} ${
								router.pathname.startsWith('/contactos') ? 'active-nav' : ''
							}`}
						>
							<Link href='/contactos/lista-de-contactos'>
								<a className={styles.sidebar__body__nav__item__link}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className={styles.sidebar__body__nav__item__linkIcon}
									>
										<path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
										<polyline points='22,6 12,13 2,6'></polyline>
									</svg>

									<span className={styles.sidebar__body__nav__item__linkTitle}>
										Contactos
									</span>
								</a>
							</Link>
						</li>
						<li
							className={`${styles.sidebar__body__nav__item} ${styles.sidebar__body__nav__category}`}
						>
							CAMPAÑA
						</li>
						<li
							className={`${styles.sidebar__body__nav__item} ${
								router.pathname.startsWith('/campaigns') ? 'active-nav' : ''
							}`}
						>
							<Link href='/campaigns'>
								<a className={styles.sidebar__body__nav__item__link}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										width='24'
										height='24'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										strokeLinecap='round'
										strokeLinejoin='round'
										className={styles.sidebar__body__nav__item__linkIcon}
									>
										<path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
										<polyline points='22,6 12,13 2,6'></polyline>
									</svg>

									<span className={styles.sidebar__body__nav__item__linkTitle}>
										Correo Electrónico
									</span>
								</a>
							</Link>
						</li>
						<li className={styles.sidebar__body__nav__item}>
							<a href='#' className={styles.sidebar__body__nav__item__link}>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
									className={styles.sidebar__body__nav__item__linkIcon}
								>
									<path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
								</svg>

								<span className={styles.sidebar__body__nav__item__linkTitle}>
									SMS
								</span>
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
};

export default Sidebar;
