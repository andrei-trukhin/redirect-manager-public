import {RedirectStatusCode} from "../../domains/redirects";


export function statusCodeValidationMessage() {
    return 'Invalid redirect status code. ' +
        `Available status codes: ${Object.keys(RedirectStatusCode).filter(k => !Number.isNaN(Number(k))).join(', ')}`;
}