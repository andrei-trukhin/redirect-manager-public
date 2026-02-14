import {RefreshTokenRepository} from "../repositories";
import {RefreshTokenEntity} from "../entities";
import {Pick} from "@prisma/client/runtime/client";
import {PrismaClient} from "@prisma/client/extension";

export class RefreshTokensPrismaRepository implements RefreshTokenRepository {

    constructor(private readonly client: PrismaClient) {
    }
    
    async delete(token: RefreshTokenEntity): Promise<void> {
        await this.deleteById(token.id);
    }

    async deleteAll(tokens: RefreshTokenEntity[]): Promise<void> {
        await this.client.refreshToken.deleteMany({
            where: {
                id: { in: tokens.map(token => token.id) }
            }
         });
    }

    async deleteById(id: string): Promise<void> {
        // call find many to make sure the operation is idempotent,
        // as deleteMany will not throw if the token does not exist
        await this.client.refreshToken.deleteMany({
            where: {
                id
            }
        });
    }

    findByToken(token: string): Promise<RefreshTokenEntity | null> {
        return this.client.refreshToken.findUnique({
            where: {
                hashedToken: token
            }
        });
    }

    findByUserId(userId: string): Promise<RefreshTokenEntity[]> {
        return this.client.refreshToken.findMany({
            where: {
                userId
            }
        });
    }

    save(token: Pick<RefreshTokenEntity, "hashedToken" | "expiresAt" | "userId">): Promise<RefreshTokenEntity> {
        return this.client.refreshToken.create({
            data: token
        });
    }

    update(token: Partial<RefreshTokenEntity>): Promise<RefreshTokenEntity> {
        return this.client.refreshToken.update({
            where: { id: token.id },
            data: token
        });
    }

}