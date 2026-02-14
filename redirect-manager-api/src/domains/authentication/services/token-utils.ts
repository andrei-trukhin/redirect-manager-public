import {createHmac} from 'node:crypto';

/**
 * Hashes a token using HMAC with a given algorithm and pepper.
 * @param token Raw token string.
 * @param algorithm Hashing algorithm (e.g., 'sha256').
 * @param pepper Secret pepper.
 */
export function hashToken(token: string, algorithm: string, pepper: string): string {
    return createHmac(algorithm, pepper)
        .update(token)
        .digest('hex');
}

/**
 * Tries to find a token in the repository using a list of peppers.
 * @param token Raw token string.
 * @param repository Token repository.
 * @param algorithm Hashing algorithm.
 * @param peppers Array of peppers to try.
 */
export async function findToken<T>(
    token: string,
    repository: TokenRepository<T>,
    algorithm: string,
    peppers: readonly string[]
): Promise<T | undefined> {
    for (const pepper of peppers) {
        const hashedToken = hashToken(token, algorithm, pepper);
        const tokenEntity = await repository.findByToken(hashedToken);
        if (tokenEntity) return tokenEntity;
    }
}

type TokenRepository<T> = {
    findByToken(token: string): Promise<T | null>;
}

