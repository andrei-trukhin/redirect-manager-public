import {describe, expect, it} from "vitest"
import {JwtService} from "./jwt.service";
import {sign} from "jsonwebtoken";
import {JwtTokenPayload, VerificationError} from "./types";

describe('Jwt Service Test', () => {

    const secret = 'secret';
    const jwtService = new JwtService();

    it('should sign a jwt token', () => {
        const token = jwtService.sign(secret);

        expect(token).toBeDefined();
    });

    it('should verify signed jwt token', () => {
        const tokenPayload = jwtService.sign(secret, {
            sub: 'test-user-id',
        });

        const verificationResult = jwtService.verify({token: tokenPayload.token, secret});

        expect(verificationResult.error).toBeNull();
        expect(verificationResult.jwtPayload).toBeDefined();
    });

    it('should return an error when verifying an invalid token', () => {
        const verificationResult = jwtService.verify({token: 'invalid-token', secret});

        expect(verificationResult.error).toBe(VerificationError.INVALID_TOKEN);
        expect(verificationResult.jwtPayload).toBeNull();
    });

    it('should return an error if payload is not valid', () => {
        const token = sign({}, secret);

        const verificationResult = jwtService.verify({token, secret: secret});
        expect(verificationResult.error).toBe(VerificationError.INVALID_PAYLOAD);
        expect(verificationResult.jwtPayload).toBeNull();
    });

    it('should return an error if secret is not valid', () => {
        const tokenPayload = jwtService.sign(secret);

        const verificationResult = jwtService.verify({token: tokenPayload.token, secret: 'invalid-secret'});
        expect(verificationResult.error).toBe(VerificationError.INVALID_TOKEN);
        expect(verificationResult.jwtPayload).toBeNull();
    });

    it('should return an error if token is expired', () => {
        const payload = {
            exp: Math.floor(Date.now() / 1000) - 1, // 1 second ago
            iat: Math.floor(Date.now() / 1000) - 1,
            scope: 'test-user',
            sub: 'test-user-id'
        } satisfies JwtTokenPayload
        const token = sign(payload, secret);

        const verificationResult = jwtService.verify({token, secret});
        expect(verificationResult.error).toBe(VerificationError.EXPIRED_TOKEN);
        expect(verificationResult.jwtPayload).toBeDefined();
    });

    it('should return an error if token is expired and payload is invalid', async () => {
        const payload = {
            exp: Math.floor(Date.now() / 1000) - 1, // 1 second ago,
        };
        const token = sign(payload, secret);

        const verificationResult = jwtService.verify({token, secret: secret});
        expect(verificationResult.error).toBe(VerificationError.INVALID_PAYLOAD);
        expect(verificationResult.jwtPayload).toBeNull();
    });
})