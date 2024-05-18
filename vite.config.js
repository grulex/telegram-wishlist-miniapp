import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import localtunnel from 'vite-plugin-localtunnel'

export default defineConfig(({mode}) => {
	return {
		plugins: [
			sveltekit(),
			startLocalTunnel(mode),
		],
	}
})

function startLocalTunnel(mode) {
	if (mode !== 'development') {
		return
	}
	return localtunnel({
		subdomain: 'wishlist',
		port: 5173,
	})
}
