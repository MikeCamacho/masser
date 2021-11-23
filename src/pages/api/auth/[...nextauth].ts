import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';

const options: NextAuthOptions = {
	theme: 'light',
	debug: true,
	session: {},
	jwt: {},
	providers: [
		Providers.Credentials({
			name: 'Masser',
			credentials: {
				email: {
					type: 'email',
				},
				password: {
					type: 'password',
				},
			},
			async authorize(credentials) {
				// conectar api
				const res = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
					{
						method: 'POST',
						body: JSON.stringify(credentials),
						headers: { 'content-type': 'application/json' },
					}
				);

				// json res API
				const user = await res.json();
				if (res.ok && user) {
					return user;
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: '/signin',
	},
};

export default NextAuth(options);
