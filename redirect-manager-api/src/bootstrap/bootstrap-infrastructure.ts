import {PrismaPg} from "@prisma/adapter-pg";
import {PrismaClient} from "../generated/prisma/client";
import {Configuration} from "../config";
import {ApiTokensPrismaRepository, RefreshTokensPrismaRepository} from "../domains/authentication";
import {RedirectsPrismaRepository} from "../domains/redirects";
import {UsersPrismaRepository} from "../domains/users";


export async function bootstrapInfrastructure({ configuration }: { configuration: Configuration }) {
    const connectionString = `${configuration.databaseConfig.DATABASE_URL}`

    const adapter = new PrismaPg({ connectionString })
    const prismaClient = new PrismaClient({adapter, log: ['info', 'warn', 'error'],});

    const refreshTokensRepository = new RefreshTokensPrismaRepository(prismaClient);
    const apiTokensRepository = new ApiTokensPrismaRepository(prismaClient);
    const redirectsRepository = new RedirectsPrismaRepository(prismaClient);
    const usersRepository = new UsersPrismaRepository(prismaClient);

    return {
        prismaClient,
        refreshTokensRepository,
        apiTokensRepository,
        redirectsRepository,
        usersRepository
    }
}