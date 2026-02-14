
export type RedirectEntity = {
    id: number
    source: string,
    destination: string,
    domain: string | null,
    statusCode: RedirectStatusCode,
    createdAt: Date,
    updatedAt: Date,
    enabled: boolean,
    isCaseSensitive: boolean
}

export enum RedirectStatusCode {
    STATUS_301 = 301,
    STATUS_302 = 302,
    STATUS_304 = 304,
    STATUS_307 = 307,
    STATUS_308 = 308
}