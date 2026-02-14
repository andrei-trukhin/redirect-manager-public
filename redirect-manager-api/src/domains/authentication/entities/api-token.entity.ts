import {TokenScope} from "../../../generated/prisma/enums";

export type ApiTokenEntity = {
    id: string;
    userId: string;
    hashedToken: string;
    name: string;
    scope: TokenScope;
    expiresAt: Date;
    createdAt: Date;
    lastUsedAt: Date | null;
}

