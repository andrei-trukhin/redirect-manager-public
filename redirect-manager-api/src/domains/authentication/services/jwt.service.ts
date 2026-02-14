import jwt from 'jsonwebtoken';
import {parseObject, ParsingError} from "bookish-potato-dto";
import {JwtTokenPayload, VerificationError, VerificationResult} from "./types";

export class JwtService {

    public static readonly EXPIRES_IN = 1000 * 60 * 15; // 15 minutes

    sign(secret: string, payload?: Record<string, any>): {
        token: string,
        expireDate: Date,
        expiresIn: number
    } {
        const expireDate = new Date(Date.now() + JwtService.EXPIRES_IN);

        return {
            token: jwt.sign({
                scope: 'access',
                ...payload
            }, secret, {
                expiresIn: JwtService.EXPIRES_IN / 1000 // jwt library expects expiresIn in seconds
            }),
            expireDate: expireDate,
            expiresIn: JwtService.EXPIRES_IN
        }
    }

    verify({token, secret}: {token: string, secret: string}): VerificationResult {
        try {
            const payload = jwt.verify(token, secret);

            return this.handlePayloadParsingError(payload);
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                const payload = jwt.verify(token, secret, {
                    ignoreExpiration: true
                });

                const result = this.handlePayloadParsingError(payload);
                if (result.error === null) {
                    return {
                        jwtPayload: result.jwtPayload,
                        error: VerificationError.EXPIRED_TOKEN
                    };
                }

                return result;
            }

            if (e instanceof jwt.JsonWebTokenError) {
                return {jwtPayload: null, error: VerificationError.INVALID_TOKEN};
            }

            return {jwtPayload: null, error: VerificationError.TOKEN_NOT_PROVIDED};
        }
    }

    private handlePayloadParsingError(payload: any): VerificationResult {
        try {
            const parsedPayload = parseObject(JwtTokenPayload, payload);
            return {
                error: null,
                jwtPayload: parsedPayload
            }
        } catch (e) {
            if (e instanceof ParsingError) {
                return {
                    jwtPayload: null,
                    error: VerificationError.INVALID_PAYLOAD
                }
            }

            console.error('Unexpected error while parsing JWT payload:', e);
            throw e;
        }
    }
}