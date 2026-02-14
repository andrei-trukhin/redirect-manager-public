import {BooleanProperty, EnumProperty, StringProperty} from "bookish-potato-dto";
import {booleanValidationMessage, statusCodeValidationMessage} from "./validation-messages";
import {RedirectStatusCode} from "../domains/redirects";

export class CreateRedirectDto {

    @StringProperty()
    readonly source!: string;
    @StringProperty()
    readonly destination!: string;
    @BooleanProperty({
        defaultValue: true,
        parsingErrorMessage: booleanValidationMessage
    })
    readonly enabled!: boolean;

    @EnumProperty(RedirectStatusCode, {
        parsingErrorMessage: statusCodeValidationMessage
    })
    readonly statusCode!: RedirectStatusCode

    @StringProperty({
        isOptional: true
    })
    readonly domain?: string;
}