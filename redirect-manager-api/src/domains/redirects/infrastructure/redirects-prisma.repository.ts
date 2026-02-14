import {RedirectBySourceResult, RedirectsRepository} from "../repositories";
import {RedirectEntity, RedirectStatusCode as RedirectStatusCodeEntity} from "../entities/redirect.entity";
import {UniqueConstraintError} from "../../../shared";
import {RedirectStatusCode} from "../../../generated/prisma/enums";
import {Redirect} from "../../../generated/prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";

import {RedirectFilterBuilder} from "./redirect-filter-builder";
import {
    CreateRedirectDto,
    CursorPaginatedResponse,
    PaginatedResponse,
    SortField,
    SortOrder,
    SupportedRedirectFilter
} from "../../../dtos";
import {PrismaClient} from "@prisma/client/extension";


export class RedirectsPrismaRepository implements RedirectsRepository {
    
    constructor(private readonly client: PrismaClient) {}
    
    async deleteRedirectById(id: number): Promise<void> {
        // call deleteMany to make sure the operation is idempotent,
        // as deleteMany will not throw if the redirect does not exist
        await this.client.redirect.deleteMany({
            where: { id }
        });
    }

    async deleteManyRedirects(ids: number[]): Promise<{ count: number }> {
        const result = await this.client.redirect.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        return { count: result.count };
    }

    async getRedirectBySource(source: string): Promise<RedirectBySourceResult | null> {
        const exactMatch = await this.client.redirect.findUnique({
            where: { source, enabled: true },
            select: {
                statusCode: true,
                source: true,
                destination: true,
                domain: true,
                enabled: true
            }
        });

        if (exactMatch) {
            const {statusCode: statusCodeEnum, ...restRedirect} = exactMatch;

            return {
                statusCode: this.mapEnumToStatusCode(statusCodeEnum),
                ...restRedirect
            }
        }

        const pathParts = source.split('/').filter(part => part.length > 0);
        const prefixes = ['/'];
        for (let i = 0; i < pathParts.length; i++) {
            prefixes.push(`/${pathParts.slice(0, i + 1).join('/')}/`);
        }

        const r = await this.client.redirect.findFirst({
            select: {
                statusCode: true,
                source: true,
                destination: true,
                domain: true,
                enabled: true
            },

            where: {
                sourcePrefix: {
                    in: prefixes,
                },
                source: {
                    endsWith: '*',
                },
                enabled: true
            },
            orderBy: {
                sourceLength: 'desc',
            },
        })

        if (!r) return null;

        const {statusCode: statusCodeEnum, ...restRedirect} = r;

        return {
            statusCode: this.mapEnumToStatusCode(statusCodeEnum),
            ...restRedirect
        }
    }

    async getRedirectById(id: number): Promise<RedirectEntity | null> {
        const r = await this.client.redirect.findUnique({where: {id}});
        return r ? this.mapRedirectToEntity(r) : null;
    }

    async getRedirects(): Promise<RedirectEntity[]> {
        const r = await this.client.redirect.findMany();
        return r.map(e => this.mapRedirectToEntity(e));
    }

    getRedirectsCount(): Promise<number> {
        return this.client.redirect.count();
    }

    async getRedirectsWithOffsetPagination(params: {
        page: number;
        limit: number;
        sortBy: SortField;
        sortOrder: SortOrder;
        filters?: SupportedRedirectFilter[];
    }): Promise<PaginatedResponse<RedirectEntity>> {
        const { page, limit, sortBy, sortOrder, filters = [] } = params;
        const skip = (page - 1) * limit;
        
        const orderBy = this.buildOrderBy(sortBy, sortOrder);
        const where = RedirectFilterBuilder.buildWhereClause(filters);
        
        const [redirects, total] = await Promise.all([
            this.client.redirect.findMany({
                skip,
                take: limit,
                orderBy,
                where
            }),
            this.client.redirect.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);
        
        return {
            data: redirects.map(e => this.mapRedirectToEntity(e)),
            pagination: {
                total,
                page,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }

    async getRedirectsWithCursorPagination(params: {
        cursor?: string | null;
        first: number;
        sortBy: SortField;
        sortOrder: SortOrder;
        filters?: SupportedRedirectFilter[];
    }): Promise<CursorPaginatedResponse<RedirectEntity>> {
        const { cursor, first, sortBy, sortOrder, filters = [] } = params;
        
        const orderBy = this.buildOrderBy(sortBy, sortOrder);
        const cursorCondition = cursor ? this.buildCursorCondition(cursor, sortOrder) : undefined;
        const filterWhere = RedirectFilterBuilder.buildWhereClause(filters);
        
        // Combine cursor condition and filter conditions
        const where = cursorCondition && Object.keys(filterWhere).length > 0
            ? { AND: [cursorCondition, filterWhere] }
            : cursorCondition || filterWhere;
        
        // Get one extra record to determine if there's a next page
        const redirects = await this.client.redirect.findMany({
            take: first + 1,
            cursor: cursor ? { id: Number.parseInt(cursor, 10) } : undefined,
            skip: cursor ? 1 : 0, // Skip cursor record itself
            where,
            orderBy
        });

        const hasNext = redirects.length > first;
        const actualRedirects = hasNext ? redirects.slice(0, first) : redirects;
        
        // Get total count with filters applied
        const total = await this.client.redirect.count({ where: filterWhere });
        
        // Generate cursors for pagination
        const nextCursor = hasNext && actualRedirects.length > 0 
            ? actualRedirects.at(-1)?.id.toString()
            : undefined;
        
        const prevCursor = cursor ? await this.getPreviousCursor(cursor, sortOrder) : undefined;
        
        return {
            data: actualRedirects.map(e => this.mapRedirectToEntity(e)),
            pagination: {
                total,
                hasNext,
                hasPrev: !!cursor,
                nextCursor,
                prevCursor
            }
        };
    }

    async saveRedirect(redirect: CreateRedirectDto): Promise<RedirectEntity> {
        const {statusCode, ...rest} = redirect;

        const entity = await this.client.redirect.create({
            data: {
                ...rest,
                statusCode: this.mapStatusCodeToEnum(statusCode),
                ...this.extractSourcePrefix(redirect.source)
            }
        }).catch(error => {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new UniqueConstraintError('Redirect with the same source already exists');
            }

            throw error;
        });

        return this.mapRedirectToEntity(entity);
    }

    private extractSourcePrefix(source: string) {
        const wildcardIndex = source.indexOf('*');
        const sourcePrefix = wildcardIndex === -1 ? source : source.substring(0, wildcardIndex);
        const sourceLength = source.length;
        return {sourcePrefix, sourceLength};
    }

    async saveAllRedirects(redirects: ReadonlyArray<CreateRedirectDto & { hash: string }>): Promise<ReadonlyArray<{id: number}>> {
        const mapped = redirects.map(redirect => {
            const {statusCode, ...rest} = redirect;
            return {
                ...rest,
                statusCode: this.mapStatusCodeToEnum(statusCode),
                ...this.extractSourcePrefix(redirect.source)
            }
        })

        return this.client.redirect.createManyAndReturn({
            data: mapped,
            skipDuplicates: true,
        }).then(r => r.map(({id}) => ({id})));
    }

    async updateRedirect(id: number, redirect: {
        source: string;
        destination: string;
        domain?: string | null;
        enabled: boolean;
        statusCode: RedirectStatusCodeEntity;
        hash: string
    }): Promise<RedirectEntity> {
        const {statusCode, ...rest} = redirect;

        const entity = await this.client.redirect.update({
            where: { id },
            data: {
                ...rest,
                updatedAt: new Date(),
                statusCode: this.mapStatusCodeToEnum(statusCode),
                ...this.extractSourcePrefix(redirect.source)
            }
        }).catch(error => {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new UniqueConstraintError('Redirect with the same source already exists');
            }

            throw error;
        });

        return this.mapRedirectToEntity(entity);
    }

    async partialUpdateRedirect(id: number, redirect: {
        source?: string;
        destination?: string;
        domain?: string | null;
        enabled?: boolean;
        statusCode?: RedirectStatusCodeEntity;
        hash?: string;
    }): Promise<RedirectEntity> {
        const updateData: any = { ...redirect };
        
        if (redirect.statusCode !== undefined) {
            updateData.statusCode = this.mapStatusCodeToEnum(redirect.statusCode);
        }

        if (redirect.source) {
            const {sourcePrefix, sourceLength} = this.extractSourcePrefix(redirect.source);
            updateData.sourcePrefix = sourcePrefix;
            updateData.sourceLength = sourceLength;
        }

        const entity = await this.client.redirect.update({
            where: { id },
            data: {
                ...updateData,
                updatedAt: new Date()
            }
        }).catch(error => {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new UniqueConstraintError(error.message);
            }

            throw error;
        });

        return this.mapRedirectToEntity(entity);
    }

    async partialUpdateBatchRedirects(updates: Array<{
        id: number;
        source?: string;
        destination?: string;
        domain?: string | null;
        enabled?: boolean;
        statusCode?: RedirectStatusCodeEntity;
        hash?: string;
    }>): Promise<Array<{ id: number; updated: boolean; error?: string; redirect?: RedirectEntity }>> {
        const results: Array<{ id: number; updated: boolean; error?: string; redirect?: RedirectEntity }> = [];

        // Use Prisma transaction to update all redirects in one transaction
        await this.client.$transaction(async (tx) => {
            for (const update of updates) {
                try {
                    const updateData: any = { ...update };
                    delete updateData.id; // Remove id from update data
                    updateData.updatedAt = Date.now();
                    
                    if (update.statusCode !== undefined) {
                        updateData.statusCode = this.mapStatusCodeToEnum(update.statusCode);
                    }

                    if (update.source) {
                        const {sourcePrefix, sourceLength} = this.extractSourcePrefix(update.source);
                        updateData.sourcePrefix = sourcePrefix;
                        updateData.sourceLength = sourceLength;
                    }

                    const entity = await tx.redirect.update({
                        where: { id: update.id },
                        data: updateData
                    });

                    results.push({
                        id: update.id,
                        updated: true,
                        redirect: this.mapRedirectToEntity(entity)
                    });
                } catch (error) {
                    results.push({
                        id: update.id,
                        updated: false,
                        error: (error as Error).message || 'Unknown error'
                    });
                }
            }
        });

        return results;
    }

    private mapStatusCodeToEnum(statusCode: RedirectStatusCodeEntity): RedirectStatusCode {
        switch (statusCode) {
            case 301:
                return RedirectStatusCode.STATUS_301;
            case 302:
                return RedirectStatusCode.STATUS_302;
            case 304:
                return RedirectStatusCode.STATUS_304;
            case 307:
                return RedirectStatusCode.STATUS_307;
            case 308:
                return RedirectStatusCode.STATUS_308;
            default:
                throw new Error(`Unknown redirect status code: ${statusCode}`);
        }
    }

    private mapEnumToStatusCode(statusCode: RedirectStatusCode): RedirectStatusCodeEntity {
        switch (statusCode) {
            case RedirectStatusCode.STATUS_301:
                return 301;
            case RedirectStatusCode.STATUS_302:
                return 302;
            case RedirectStatusCode.STATUS_304:
                return 304;
            case RedirectStatusCode.STATUS_307:
                return 307;
            case RedirectStatusCode.STATUS_308:
                return 308;
            default:
                throw new Error(`Unknown redirect status code: ${statusCode}`);
        }
    }

    private mapRedirectToEntity(redirect: Redirect): RedirectEntity {
        const {
            statusCode: statusCodeEnum,
            sourceLength,
            sourcePrefix,
            ...restRedirect
        } = redirect;

        return {
            statusCode: this.mapEnumToStatusCode(statusCodeEnum),
            ...restRedirect
        }
    }

    private buildOrderBy(sortBy: SortField, sortOrder: SortOrder): any {
        const order = sortOrder === SortOrder.ASC ? 'asc' : 'desc';
        
        switch (sortBy) {
            case SortField.ID:
                return { id: order };
            case SortField.CREATED_AT:
                return { createdAt: order };
            case SortField.UPDATED_AT:
                return { updatedAt: order };
            case SortField.SOURCE:
                return { source: order };
            case SortField.DESTINATION:
                return { destination: order };
            default:
                return { id: order };
        }
    }

    private buildCursorCondition(cursor: string, sortOrder: SortOrder) {
        const cursorId = Number.parseInt(cursor, 10);
        const operator = sortOrder === SortOrder.ASC ? 'gt' : 'lt';
        
        // For cursor pagination, we primarily use ID-based cursors for simplicity
        // More complex implementations could use composite cursors for other sort fields
        return {
            id: {
                [operator]: Number.isNaN(cursorId) ? undefined : cursorId
            }
        };
    }

    private async getPreviousCursor(cursor: string, sortOrder: SortOrder): Promise<string | undefined> {
        const cursorId = Number.parseInt(cursor, 10);
        const oppositeOrder = sortOrder === SortOrder.ASC ? 'desc' : 'asc';
        
        const previousRecord = await this.client.redirect.findFirst({
            where: {
                id: {
                    [sortOrder === SortOrder.ASC ? 'lt' : 'gt']: cursorId
                }
            },
            orderBy: { id: oppositeOrder },
            select: { id: true }
        });

        return previousRecord?.id.toString();
    }
}