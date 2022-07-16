import { defineConfig } from "vite";

export default defineConfig({
	build: {
		target: "esnext",
	},
	server: {
		port: 3000,
		host: true,
	},
	preview: {
		host: true,
		port: 8080,
	},
});
