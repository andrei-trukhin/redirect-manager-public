import {CustomProperty, EnumProperty, IntegerProperty, ParsingError, StringProperty} from "bookish-potato-dto";

export enum JwtHashAlgorithm {
    SHA256 = 'sha256',
    SHA512 = 'sha512'
}

/**
 * Configuration for authentication service.
 */
export class AuthConfig {
    /**
     * Used for token hashing.
     */
    @StringProperty({
        minLength: 16
    })
    readonly JWT_SECRET!: string;

    /**
     * Used for hashing tokens.
     * TOKEN_HASH_PEPPER is an additional secret that being used to hash tokens, providing an extra layer of security.
     * It should be a random string of sufficient length (e.g., 16-64 characters) and kept secret.
     * Provided as a comma-separated list of strings,
     *  allowing for multiple peppers to be used and rotated over time without invalidating existing tokens.
     * The first pepper in the list will be used for hashing new tokens,
     *  while all peppers will be accepted for verifying existing tokens.
     */
    @CustomProperty({
        parser: {
            parse: (value: unknown) => {
                if (typeof value !== 'string') {
                    throw new ParsingError('TOKEN_HASH_PEPPER must be a comma separated array string.');
                }

                if (value.trim() === '') {
                    throw new ParsingError('TOKEN_HASH_PEPPER cannot be an empty string.');
                }

                return value.split(',').map(s => s.trim())
            },
        },
    })
    readonly TOKEN_HASH_PEPPER!: readonly string[];
    /**
     * Algorithm used for hashing tokens.
     */
    @EnumProperty(JwtHashAlgorithm, {
        defaultValue: JwtHashAlgorithm.SHA256,
        useDefaultValueOnParseError: true
    })
    readonly JWT_HASH_ALGORITHM!: JwtHashAlgorithm;

    /**
     * Used for hashing user passwords.
     */
    @IntegerProperty({defaultValue: 10, minValue: 4, useDefaultValueOnParseError: true})
    readonly PASSWORD_SALT_ROUNDS!: number;
}
