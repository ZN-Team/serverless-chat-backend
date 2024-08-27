export class HandlerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HandlerError'; // Custom name for error identification
        Object.setPrototypeOf(this, new.target.prototype); // Maintain prototype chain
    }
}
