import {DateProperty, EnumProperty, StringProperty} from "bookish-potato-dto";
import {TokenScope} from "../generated/prisma/enums";
import {statusCodeValidationMessage} from "./validation-messages/api-token-scope-validation.message";

export class CreateApiTokenDto {
    @StringProperty({
        minLength: 1,
        maxLength: 255
    })
    readonly name!: string;

    @EnumProperty(TokenScope, {
        parsingErrorMessage: statusCodeValidationMessage
    })
    readonly scope!: TokenScope;

    @DateProperty()
    readonly expiresAt!: Date;
}

