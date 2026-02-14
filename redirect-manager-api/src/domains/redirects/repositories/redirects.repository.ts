import {RedirectEntity, RedirectStatusCode} from "../entities";
import {
    CreateRedirectDto,
    CursorPaginatedResponse,
    PaginatedResponse,
    SortField,
    SortOrder,
    SupportedRedirectFilter
} from "../../../dtos";

export interface RedirectsRepository {
    getRedirects(): Promise<RedirectEntity[]>

    getRedirectsCount(): Promise<number>

    getRedirectsWithOffsetPagination(params: {
        page: number;
        limit: number;
        sortBy: SortField;
        sortOrder: SortOrder;
        filters?: SupportedRedirectFilter[];
    }): Promise<PaginatedResponse<RedirectEntity>>

    getRedirectsWithCursorPagination(params: {
        cursor?: string | null;
        first: number;
        sortBy: SortField;
        sortOrder: SortOrder;
        filters?: SupportedRedirectFilter[];
    }): Promise<CursorPaginatedResponse<RedirectEntity>>

    saveRedirect(redirect: CreateRedirectDto): Promise<RedirectEntity>

    saveAllRedirects(redirects: ReadonlyArray<CreateRedirectDto>): Promise<ReadonlyArray<{ id: number }>>

    updateRedirect(id: number, redirect: {
        source: string;
        destination: string;
        domain?: string | null;
        enabled: boolean;
        statusCode: RedirectStatusCode;
    }): Promise<RedirectEntity>

    partialUpdateRedirect(id: number, redirect: {
        source?: string;
        destination?: string;
        domain?: string | null;
        enabled?: boolean;
        isCaseSensitive?: boolean;
        statusCode?: RedirectStatusCode;
    }): Promise<RedirectEntity>

    partialUpdateBatchRedirects(updates: Array<{
        id: number;
        source?: string;
        destination?: string;
        domain?: string | null;
        enabled?: boolean;
        isCaseSensitive?: boolean;
        statusCode?: RedirectStatusCode;
    }>): Promise<Array<{ id: number; updated: boolean; error?: string; redirect?: RedirectEntity }>>

    deleteRedirectById(id: number): Promise<void>

    deleteManyRedirects(ids: number[]): Promise<{ count: number }>

    getRedirectById(id: number): Promise<RedirectEntity | null>

    getRedirectBySource(source: string): Promise<RedirectBySourceResult | null>
}

export type RedirectBySourceResult =
    Pick<RedirectEntity, 'source' | 'domain' | 'destination' | 'enabled' | 'statusCode'>;