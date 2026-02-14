import {ArrayDtoProperty, BooleanProperty, EnumProperty, NumberProperty, StringProperty} from "bookish-potato-dto";
import {booleanValidationMessage, statusCodeValidationMessage} from "./validation-messages";
import {RedirectStatusCode} from "../domains/redirects";

export class UpdateBatchRedirectItemDto {
    @NumberProperty()
    readonly id!: number;

    @StringProperty({
        isOptional: true
    })
    readonly destination?: string;

    @StringProperty({
        isOptional: true
    })
    readonly source?: string;

    @StringProperty({
        isOptional: true,
        isNullable: true,
        useDefaultValueOnParseError: true
    })
    readonly domain?: string | null;

    @BooleanProperty({
        isOptional: true,
        parsingErrorMessage: booleanValidationMessage
    })
    readonly enabled?: boolean;

    @EnumProperty(RedirectStatusCode, {
        isOptional: true,
        parsingErrorMessage: statusCodeValidationMessage
    })
    readonly statusCode?: string;
}

export class UpdateBatchRedirectDto {

    @ArrayDtoProperty(UpdateBatchRedirectItemDto)
    readonly redirects!: UpdateBatchRedirectItemDto[];

}