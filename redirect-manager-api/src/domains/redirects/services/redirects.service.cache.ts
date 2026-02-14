import {RedirectBySourceResult} from "../repositories";
import NodeCache from "node-cache";
import {RedirectsService} from "./redirects.service";
import {
    CreateRedirectDto,
    CursorPaginatedResponse,
    FullUpdateRedirectDto,
    ListRedirectsDto,
    PaginatedResponse,
    UpdateBatchRedirectItemDto,
    UpdateRedirectDto
} from "../../../dtos";
import {RedirectEntity} from "../entities";

/**
 * Decorator class for caching redirects service.
 */
export class RedirectsServiceCache implements Omit<RedirectsService, 'modifySourceAndDestination' | 'modifyPath'> {

    private readonly cache: NodeCache;

    constructor(private readonly delegate: RedirectsService, private readonly cacheTTLSeconds: number) {
        this.cache = new NodeCache({
            stdTTL: cacheTTLSeconds,
        })
    }

    createRedirect(redirect: CreateRedirectDto): Promise<RedirectEntity> {
        return this.delegate.createRedirect(redirect);
    }

    createBatchRedirects(redirects: CreateRedirectDto[]): Promise<ReadonlyArray<{ id: number }>> {
        return this.delegate.createBatchRedirects(redirects);
    }

    async getRedirectsPaginated(params: ListRedirectsDto): Promise<PaginatedResponse<RedirectEntity> | CursorPaginatedResponse<RedirectEntity>> {
        return this.delegate.getRedirectsPaginated(params);
    }

    async deleteManyRedirects(ids: number[]): Promise<{ count: number }> {
        return this.delegate.deleteManyRedirects(ids);
    }

    async deleteRedirect(id: number): Promise<void> {
        return this.delegate.deleteRedirect(id);
    }

    async findRedirectBySource(source: string): Promise<RedirectBySourceResult | null> {
        if (this.cache.has(source)) {
            return this.cache.get(source) as RedirectBySourceResult | null;
        }

        const result = await this.delegate.findRedirectBySource(source);
        this.cache.set(source, result);
        return result;
    }

    async getRedirectById(id: number): Promise<RedirectEntity | null> {
        return this.delegate.getRedirectById(id);
    }

    async partialUpdateBatchRedirects(updates: Array<UpdateBatchRedirectItemDto>): Promise<Array<{
        id: number;
        updated: boolean;
        error?: string;
        redirect?: RedirectEntity
    }>> {
        return this.delegate.partialUpdateBatchRedirects(updates);
    }

    async partialUpdateRedirect(id: number, redirect: UpdateRedirectDto): Promise<RedirectEntity> {
        return this.delegate.partialUpdateRedirect(id, redirect);
    }

    updateRedirect(id: number, redirect: FullUpdateRedirectDto): Promise<RedirectEntity> {
        return this.delegate.updateRedirect(id, redirect);
    }
}