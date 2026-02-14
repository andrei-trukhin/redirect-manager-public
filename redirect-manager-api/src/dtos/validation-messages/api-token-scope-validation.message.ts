import {TokenScope} from "../../generated/prisma/enums";

export function statusCodeValidationMessage() {
    return 'Invalid token scope value. ' +
        `Available values: ${Object.keys(TokenScope).filter(k => !Number.isNaN(Number(k))).join(', ')}`;
}