import {Request, Response, Router, RequestHandler} from "express";
import {RouterController} from "../../router-controller.type";
import {parseObject} from "bookish-potato-dto";
import {RedirectsService} from "../../../domains/redirects";
import {BadRequestHttpError, methodNotAllowed, NotFoundHttpError, requireScope} from "../../shared";
import {
    CreateRedirectDto,
    DeleteRedirectsBatchDto,
    FullUpdateRedirectDto,
    ListRedirectsDto,
    UpdateBatchRedirectItemDto,
    UpdateRedirectDto
} from "../../../dtos";

export class RedirectsRouter implements RouterController {

    constructor(
        private readonly redirectsService: RedirectsService,
        private readonly authMiddleware: RequestHandler
    ) {
    }

    public getBasePath(): string {
        return '/redirects';
    }

    public initRoutes(): Router {
        const router = Router();

        router.use(this.authMiddleware);

        router.route('/')
            .get(requireScope(['READ', 'READ_WRITE']), this.getAllRedirects.bind(this))
            .post(requireScope(['READ_WRITE']), this.createRedirect.bind(this))
            .all(methodNotAllowed)

        router.route('/batch')
            .post(requireScope(['READ_WRITE']), this.createBatchRedirects.bind(this))
            .delete(requireScope(['READ_WRITE']), this.deleteBatchRedirects.bind(this))
            .patch(requireScope(['READ_WRITE']), this.partialUpdateBatchRedirects.bind(this))
            .all(methodNotAllowed)

        router.route('/:id')
            .get(requireScope(['READ', 'READ_WRITE']), this.getSingleRedirect.bind(this))
            .put(requireScope(['READ_WRITE']), this.updateRedirect.bind(this))
            .patch(requireScope(['READ_WRITE']), this.partialUpdateRedirect.bind(this))
            .delete(requireScope(['READ_WRITE']), this.deleteRedirect.bind(this))
            .all(methodNotAllowed);

        return router;
    }

    /**
     * Creates a redirect.
     * @param req
     * @param res
     * @private
     */
    private async createRedirect(req: Request, res: Response) {
        const dto = parseObject(CreateRedirectDto, req.body);
        this.validateRedirect(dto);

        const result = await this.redirectsService.createRedirect(dto);

        res.status(201).send(
            {
                message: 'Redirect created successfully',
                location: `${this.getBasePath()}/${result.id}`
            }
        );
    }

    /**
     * Creates a batch of redirects.
     * Batch creation is done in a single transaction.
     * If a redirect is invalid, it is not created.
     * If a redirect is valid, it is created.
     * Returns the result of the batch operation.
     * Ignores duplicate redirects.
     */
    private async createBatchRedirects(req: Request, res: Response) {
        if (!Array.isArray(req.body?.redirects)) {
            throw new BadRequestHttpError('Invalid request body. Expected array of redirects.');
        }

        if (req.body?.redirects.length === 0) {
            throw new BadRequestHttpError('Invalid request body. Redirects array cannot be empty.');
        }

        const badRequestRedirects: Array<{
            message: string;
            redirect: unknown;
        }> = [];
        const validRedirects: Array<CreateRedirectDto> = [];

        for (const redirect of req.body.redirects) {
            try {
                const parsedRedirect = parseObject(CreateRedirectDto, redirect);
                this.validateRedirect(parsedRedirect);
                validRedirects.push(parsedRedirect);
            } catch (e) {
                badRequestRedirects.push({
                    message: (e as Error).message || JSON.stringify(e),
                    redirect
                });
            }
        }

        if (validRedirects.length === 0) {
            throw new BadRequestHttpError('Invalid request body, all redirects are invalid');
        }

        const result = await this.redirectsService.createBatchRedirects(validRedirects);

        const createdRedirects = result.map(redirect => ({
            message: 'Redirect created successfully',
            location: `${this.getBasePath()}/${redirect.id}`
        }))

        if (badRequestRedirects.length > 0) {
            res.status(207).send({
                message: 'Some redirects were invalid and were not created.',
                invalidRedirects: badRequestRedirects.length,
                badRequestRedirects,
                createdCount: createdRedirects.length,
                createdRedirects
            });
        }

        res.status(201).send({
            message: 'All redirects created successfully.',
            createdRedirects,
            createdCount: createdRedirects.length
        });
    }

    /**
     * Partially updates a batch of redirects.
     * Batch update is done individually for each redirect.
     * If a redirect is invalid or an update fails, it is not updated.
     * If a redirect is valid, it is updated.
     * Returns the result of the batch operation.
     * @param req
     * @param res
     * @private
     */
    private async partialUpdateBatchRedirects(req: Request, res: Response) {
        if (!Array.isArray(req.body?.redirects)) {
            throw new BadRequestHttpError('Invalid request body. Expected array of redirects.');
        }

        if (req.body?.redirects.length === 0) {
            throw new BadRequestHttpError('Invalid request body. Redirects array cannot be empty.');
        }

        const badRequestRedirects: Array<{
            message: string;
            redirect: unknown;
        }> = [];
        const validRedirects: Array<UpdateBatchRedirectItemDto> = [];

        for (const redirect of req.body.redirects) {
            try {
                const parsedRedirect = parseObject(UpdateBatchRedirectItemDto, redirect);
                if (parsedRedirect.source && parsedRedirect.destination) {
                    this.validateRedirect(parsedRedirect as Pick<CreateRedirectDto, 'source' | 'destination'>);
                }
                validRedirects.push(parsedRedirect);
            } catch (e) {
                badRequestRedirects.push({
                    message: (e as Error).message || JSON.stringify(e),
                    redirect
                });
            }
        }

        if (validRedirects.length === 0) {
            throw new BadRequestHttpError('Invalid request body, all redirects are invalid');
        }

        const results = await this.redirectsService.partialUpdateBatchRedirects(validRedirects);

        const successfulUpdates = results.filter(r => r.updated);
        const failedUpdates = results.filter(r => !r.updated);

        const updatedRedirects = successfulUpdates.map(result => ({
            message: 'Redirect updated successfully',
            id: result.id,
            location: `${this.getBasePath()}/${result.id}`
        }));

        const allFailedRedirects = [...badRequestRedirects, ...failedUpdates.map(f => ({
            message: f.error || 'Update failed',
            redirect: { id: f.id }
        }))];

        if (allFailedRedirects.length > 0) {
            res.status(207).send({
                message: 'Some redirects could not be updated.',
                invalidRedirects: allFailedRedirects.length,
                badRequestRedirects: allFailedRedirects,
                updatedCount: updatedRedirects.length,
                updatedRedirects
            });
            return;
        }

        res.status(200).send({
            message: 'All redirects updated successfully.',
            updatedRedirects,
            updatedCount: updatedRedirects.length
        });
    }

    /**
     * Returns paginated redirects with both offset and cursor pagination support.
     * @param req
     * @param res
     * @private
     */
    private async getAllRedirects(req: Request, res: Response) {
        const dto = parseObject(ListRedirectsDto, req.query);

        const result = await this.redirectsService.getRedirectsPaginated(dto);
        res.status(200).send(result);
    }

    /**
     * Returns a single redirect by ID.
     * @param req
     * @param res
     * @private
     */
    private async getSingleRedirect(req: Request, res: Response) {
        const id = this.extractedId(req);

        const redirect = await this.redirectsService.getRedirectById(id);

        if (!redirect) {
            throw new NotFoundHttpError('Redirect not found.');
        }

        res.status(200).send(redirect);
    }

    /**
     * Updates a redirect (full update).
     * @param req
     * @param res
     * @private
     */
    private async updateRedirect(req: Request, res: Response) {
        const id = this.extractedId(req);

        const dto = parseObject(FullUpdateRedirectDto, req.body);
        this.validateRedirect(dto);

        const result = await this.redirectsService.updateRedirect(id, dto);
        res.status(200).send({
            message: 'Redirect updated successfully',
            location: `${this.getBasePath()}/${result.id}`
        });
    }

    /**
     * Updates a redirect (partial update).
     * @param req
     * @param res
     * @private
     */
    private async partialUpdateRedirect(req: Request, res: Response) {
        const id = this.extractedId(req);

        const dto = parseObject(UpdateRedirectDto, req.body);
        if (dto.source && dto.destination) {
            this.validateRedirect({
                source: dto.source,
                destination: dto.destination
            });
        }

        const result = await this.redirectsService.partialUpdateRedirect(id, dto)
        res.status(200).send({
            message: 'Redirect updated successfully',
            location: `${this.getBasePath()}/${result.id}`
        });
    }

    /**
     * Deletes a redirect (hard delete).
     * @param req
     * @param res
     * @private
     */
    private async deleteRedirect(req: Request, res: Response) {
        const id = Number.parseInt(req.params.id, 10);
        
        if (Number.isNaN(id)) {
            throw new BadRequestHttpError('Invalid redirect ID.');
        }

        await this.redirectsService.deleteRedirect(id);
        res.status(204).send(); // 204 No Content
    }

    /**
     * Deletes multiple redirects (batch delete).
     * @param req
     * @param res
     * @private
     */

    private async deleteBatchRedirects(req: Request, res: Response) {
        const dto = parseObject(DeleteRedirectsBatchDto, req.body);

        const result = await this.redirectsService.deleteManyRedirects(dto.ids);
        res.status(200).send({
            message: 'Redirects deleted successfully',
            deletedCount: result.count
        });
    }

    private extractedId(req: Request): number {
        const id = Number.parseInt(req.params.id, 10);

        if (Number.isNaN(id)) {
            throw new BadRequestHttpError('Invalid redirect ID.');
        }
        return id;
    }

    private validateRedirect(redirect: Pick<CreateRedirectDto, 'source' | 'destination'>) {
        if (redirect.source === redirect.destination) {
            throw new BadRequestHttpError('Source and destination cannot be the same.');
        }
    }
}