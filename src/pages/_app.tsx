import '../styles/globals.scss';
import 'codemirror/lib/codemirror.css';
import type { AppProps } from 'next/app';
import { Provider as AuthProvider } from 'next-auth/client';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider session={pageProps.session}>
			<Component {...pageProps} />
		</AuthProvider>
	);
}
export default MyApp;
