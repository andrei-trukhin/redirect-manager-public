import {StringProperty} from "bookish-potato-dto";


export class DatabaseConfig {

    @StringProperty()
    readonly DATABASE_URL!: string;
    
}