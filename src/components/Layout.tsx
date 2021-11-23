import { FunctionComponent, useState } from 'react';

import Header from '../components/Header/index';
import Sidebar from './Sidebar';

const Layout: FunctionComponent = ({ children }) => {
	const [collapseSidebar, setCollapseSidebar] = useState(false);

	return (
		<div className='main_wrapper'>
			<Sidebar
				setCollapseSidebar={setCollapseSidebar}
				collapseSidebar={collapseSidebar}
			/>
			<div
				className={`page_wrapper ${
					collapseSidebar ? 'page_wrapper_expanded' : ''
				}`}
			>
				<Header collapseSidebar={collapseSidebar} />
				<div className='page_content'>{children}</div>
			</div>
		</div>
	);
};

export default Layout;
