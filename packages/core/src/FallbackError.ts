import { PlataElement } from './types';

class FallbackError extends Error {
	fallback: PlataElement;
	originalError: Error;
	constructor(error: Error, fallback: PlataElement) {
		super(error.message);
		this.originalError = error;
		this.fallback = fallback;
	}
}

export { FallbackError };
