import {RedirectEntity} from "../entities";
import {RedirectBySourceResult, RedirectsRepository} from "../repositories";
import {RedirectNotFoundError} from "../../../shared";
import {
    CreateRedirectDto,
    CursorPaginatedResponse,
    FullUpdateRedirectDto,
    ListRedirectsDto,
    PaginatedResponse,
    PaginationType,
    RedirectFilterParser,
    UpdateBatchRedirectItemDto,
    UpdateRedirectDto
} from "../../../dtos";

export class RedirectsService {

    constructor(private readonly redirectsRepository: RedirectsRepository) {
    }

    createRedirect(redirect: CreateRedirectDto): Promise<RedirectEntity> {
        return this.redirectsRepository.saveRedirect({
            ...this.modifySourceAndDestination(redirect)
        });
    }

    createBatchRedirects(redirects: CreateRedirectDto[]): Promise<ReadonlyArray<{ id: number }>> {
        return this.redirectsRepository.saveAllRedirects(redirects);
    }

    async getRedirectsPaginated(params: ListRedirectsDto): Promise<PaginatedResponse<RedirectEntity> | CursorPaginatedResponse<RedirectEntity>> {
        // Parse filter parameters
        const filters = RedirectFilterParser.parseFilters(params);
        
        if (params.paginationType === PaginationType.CURSOR) {
            const result = await this.redirectsRepository.getRedirectsWithCursorPagination({
                cursor: params.cursor,
                first: params.first,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                filters
            });

            return {
                data: result.data.map(redirect => {
                    return redirect;
                }),
                pagination: result.pagination
            };
        } else {
            const result = await this.redirectsRepository.getRedirectsWithOffsetPagination({
                page: params.page,
                limit: params.limit,
                sortBy: params.sortBy,
                sortOrder: params.sortOrder,
                filters
            });

            return {
                data: result.data.map(redirect => {
                    return redirect;
                }),
                pagination: result.pagination
            };
        }
    }

    async getRedirectById(id: number): Promise<RedirectEntity | null> {
        const result = await this.redirectsRepository.getRedirectById(id);
        if (!result) return null;
        return result;
    }

    async findRedirectBySource(source: string): Promise<RedirectBySourceResult | null> {
        return this.redirectsRepository.getRedirectBySource(source);
    }

    updateRedirect(id: number, redirect: FullUpdateRedirectDto): Promise<RedirectEntity> {

        const redirectMutable = redirect as any;

        if (redirectMutable.source) redirectMutable.source = this.modifyPath(redirectMutable.source);
        if (redirectMutable.destination) redirectMutable.destination = this.modifyPath(redirectMutable.destination);

        return this.redirectsRepository.updateRedirect(id, redirectMutable);
    }

    async partialUpdateRedirect(id: number, redirect: UpdateRedirectDto): Promise<RedirectEntity> {
        const updateData: any = this.modifySourceAndDestination(redirect);
        return this.redirectsRepository.partialUpdateRedirect(id, updateData);
    }

    async deleteRedirect(id: number): Promise<void> {
        // Check if redirect exists before deleting
        const existingRedirect = await this.redirectsRepository.getRedirectById(id);
        if (!existingRedirect) {
            throw new RedirectNotFoundError(id);
        }

        await this.redirectsRepository.deleteRedirectById(id);
    }

    async deleteManyRedirects(ids: number[]): Promise<{ count: number }> {
        return await this.redirectsRepository.deleteManyRedirects(ids);
    }

    async partialUpdateBatchRedirects(updates: Array<UpdateBatchRedirectItemDto>): Promise<Array<{
        id: number;
        updated: boolean;
        error?: string;
        redirect?: RedirectEntity
    }>> {
        const repositoryUpdates: any[] = [];

        for (const update of updates) {
            const updateData: any = this.modifySourceAndDestination(update);
            repositoryUpdates.push(updateData);
        }

        // Use repository's batch update method with transaction
        return await this.redirectsRepository.partialUpdateBatchRedirects(repositoryUpdates);
    }

    private modifySourceAndDestination(data: any): any {
        if (data.source) data.source = this.modifyPath(data.source);
        if (data.destination) data.destination = this.modifyPath(data.destination);
        return data;
    }

    private modifyPath(path: string): string {
        if (path.startsWith('/')) {
            return path;
        }

        return `/${path}`;
    }
}
