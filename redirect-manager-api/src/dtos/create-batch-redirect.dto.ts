import {CreateRedirectDto} from "./create-redirect.dto";
import {ArrayDtoProperty} from "bookish-potato-dto";

export class CreateBatchRedirectDto {

    @ArrayDtoProperty(CreateRedirectDto)
    readonly redirects!: CreateRedirectDto[];

}