import {ArrayProperty} from "bookish-potato-dto";

export class DeleteRedirectsBatchDto {

    @ArrayProperty('number', { minLength: 1 })
    readonly ids!: number[];
}