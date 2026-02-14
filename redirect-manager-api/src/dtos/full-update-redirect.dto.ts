import {BooleanProperty, EnumProperty, StringProperty} from "bookish-potato-dto";
import {RedirectStatusCode} from "../domains/redirects";
import {booleanValidationMessage, statusCodeValidationMessage} from "./validation-messages";

export class FullUpdateRedirectDto {

    @StringProperty()
    readonly source!: string;

    @StringProperty()
    readonly destination!: string;

    @StringProperty({
        isOptional: true,
        isNullable: true,
        defaultValue: null,
        useDefaultValueOnParseError: true
    })
    readonly domain?: string | null;

    @BooleanProperty({
        defaultValue: true,
        parsingErrorMessage: booleanValidationMessage
    })
    readonly enabled!: boolean;

    @EnumProperty(RedirectStatusCode, {
        parsingErrorMessage: statusCodeValidationMessage
    })
    readonly statusCode!: RedirectStatusCode
}