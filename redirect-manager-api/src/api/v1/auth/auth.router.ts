import {RouterController} from "../../router-controller.type";
import {Request, Response, Router} from "express";
import {BooleanProperty, parseObject, StringProperty} from "bookish-potato-dto";
import {methodNotAllowed, UnauthorizedHttpError} from "../../shared";
import {AuthService} from "../../../domains/authentication";

export class AuthRouter implements RouterController {

    constructor(private readonly authService: AuthService) {
    }

    getBasePath(): string {
        return `/auth`;
    }

    initRoutes(): Router {
        const router = Router();

        router.route('/login')
            .post(this.login.bind(this))
            .all(methodNotAllowed);

        router.route('/logout')
            .post(this.logout.bind(this))
            .all(methodNotAllowed);

        router.route('/refresh')
            .post(this.refreshToken.bind(this))
            .all(methodNotAllowed);

        return router;
    }


    private async login(req: Request, res: Response) {
        const credentials = parseObject(AuthenticationCredentialsDto, req.body);

        const authResult = await this.authService.login(credentials);

        if (!authResult?.user) {
            throw new UnauthorizedHttpError('Invalid credentials');
        }

        const { refreshToken, expiresIn: refreshTokenExpiresIn } = authResult.refreshToken;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/v1/auth',
            maxAge: refreshTokenExpiresIn * 1000
        });

        const { jwt, expiresIn: jwtExpiresIn } = authResult.jwt;

        res.status(200).json({
            access_token: jwt,
            token_type: 'Bearer',
            expires_in: jwtExpiresIn
        });
    }


    private async logout(req: Request, res: Response) {
        // 1. Validate JWT token to ensure the user is authenticated before logging out
        const token = req.headers.authorization?.replace('Bearer ', '')
        if (!token) {
            throw new UnauthorizedHttpError('No jwt token provided');
        }

        await this.authService.validateJwt(token);

        // 2. Get the refresh token from the cookie to identify which session to log out
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            throw new UnauthorizedHttpError('No refresh token provided');
        }

        const body = parseObject(LogoutDto, req.body);

        await this.authService.logout(refreshToken, body.allDevices);

        // 3. Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/v1/auth',
        });

        res.sendStatus(204);
    }


    private async refreshToken(req: Request, res: Response) {
        // Retrieve refresh token from a cookie
        const refreshToken = req.cookies['refreshToken'];

        if (!refreshToken) {
            throw new UnauthorizedHttpError('No refresh token provided');
        }

        // 1. Issue a new JWT token using the refresh token
        const jwtResult = await this.authService.issueJwt(refreshToken);
        // 2. If the refresh token is valid, rotate it by issuing a new refresh token and revoking the old one
        const newRefreshToken = await this.authService.refreshToken(refreshToken);

        // 3. Set the new refresh token in the cookie
        res.cookie('refreshToken', newRefreshToken.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/v1/auth',
            maxAge: newRefreshToken.expiresIn * 1000
        });

        res.status(200).json({
            access_token: jwtResult.jwt,
            token_type: 'Bearer',
            expires_in: jwtResult.expiresIn
        });
    }
}

class AuthenticationCredentialsDto {
    @StringProperty()
    readonly username!: string;
    @StringProperty()
    readonly password!: string;
}

class LogoutDto {
    @BooleanProperty({
        isOptional: true,
    })
    readonly allDevices?: boolean;
}
