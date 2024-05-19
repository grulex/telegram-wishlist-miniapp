import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import localtunnel from 'vite-plugin-localtunnel'

export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd());

	return {
		plugins: [
			sveltekit(),
			startLocalTunnel(mode),
		],
		server: {
			port: `${env.PORT ?? '5173'}`,
		},
	}
})

function startLocalTunnel(mode) {
	const env = loadEnv(mode, process.cwd());

	if (mode !== 'development') {
		return
	}
	return localtunnel({
		subdomain: `${env.TUNNEL_SUBDOMAIN ?? 'wishlist'}`,
		port: `${env.PORT ?? '5173'}`,
	})
}
