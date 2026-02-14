import {StringProperty} from "bookish-potato-dto";

export class PutLicenseDto {

    @StringProperty({ minLength: 1 })
    readonly licenseKey!: string;

}