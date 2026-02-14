
export class RedirectNotFoundError extends Error {
    constructor(id: number) {
        super(`Redirect with id ${id} not found`);
    }
}