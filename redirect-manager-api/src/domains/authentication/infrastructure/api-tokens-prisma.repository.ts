import {ApiTokenEntity} from "../entities";
import {ApiTokenRepository} from "../repositories";
import {PrismaClient} from "@prisma/client/extension";

export class ApiTokensPrismaRepository implements ApiTokenRepository {

    constructor(private readonly client: PrismaClient) {}

    async delete(token: ApiTokenEntity): Promise<void> {
        await this.deleteById(token.id);
    }

    async deleteAll(tokens: ApiTokenEntity[]): Promise<void> {
        await this.client.apiToken.deleteMany({
            where: {
                id: {in: tokens.map(token => token.id)}
            }
        });
    }

    async deleteById(id: string): Promise<void> {
        // call find many to make sure the operation is idempotent,
        // as deleteMany will not throw if the token does not exist
        await this.client.apiToken.deleteMany({
            where: {
                id
            }
        });
    }

    findByToken(token: string): Promise<ApiTokenEntity | null> {
        return this.client.apiToken.findUnique({
            where: {
                hashedToken: token
            }
        });
    }

    findById(id: string): Promise<ApiTokenEntity | null> {
        return this.client.apiToken.findUnique({
            where: {
                id
            }
        });
    }

    findByUserId(userId: string): Promise<ApiTokenEntity[]> {
        return this.client.apiToken.findMany({
            where: {
                userId
            }
        });
    }

    save(token: Pick<ApiTokenEntity, "hashedToken" | "expiresAt" | "userId" | "name" | "scope">): Promise<ApiTokenEntity> {
        return this.client.apiToken.create({
            data: token
        });
    }

    update(token: Partial<ApiTokenEntity> & { id: string }): Promise<ApiTokenEntity> {
        return this.client.apiToken.update({
            where: {id: token.id},
            data: token
        });
    }

}
