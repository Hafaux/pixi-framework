const debugLog = (...messages: unknown[]) => {
	if (import.meta.env.DEV) {
		console.log(`[DEBUG LOG]:`, ...messages);
	}
};

const debugWarn = (...messages: unknown[]) => {
	if (import.meta.env.DEV) {
		console.warn(`[DEBUG WARN]:`, ...messages);
	}
};

export const debug = {
	log: debugLog,
	warn: debugWarn,
};
