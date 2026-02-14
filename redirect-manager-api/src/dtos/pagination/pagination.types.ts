export interface PaginationMeta {
    total: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
}

export interface CursorPaginationMeta {
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
}

export interface CursorPaginatedResponse<T> {
    data: T[];
    pagination: CursorPaginationMeta;
}

export enum PaginationType {
    OFFSET = 'offset',
    CURSOR = 'cursor'
}

export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}

export enum SortField {
    ID = 'id',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    SOURCE = 'source',
    DESTINATION = 'destination'
}