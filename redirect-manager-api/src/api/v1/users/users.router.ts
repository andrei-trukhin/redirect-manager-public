import {RouterController} from "../../router-controller.type";
import {Request, RequestHandler, Response, Router} from "express";
import {EnumProperty, parseObject, StringProperty} from "bookish-potato-dto";
import {ForbiddenHttpError, methodNotAllowed, requireRole, requireScope, UnauthorizedHttpError} from "../../shared";
import {UsersService} from "../../../domains/users";
import {UserRole} from "../../../generated/prisma/enums";

export class UsersRouter implements RouterController {

    constructor(
        private readonly usersService: UsersService,
        private readonly authMiddleware: RequestHandler
    ) {
    }

    getBasePath(): string {
        return `/users`;
    }

    initRoutes(): Router {
        const router = Router();

        router.use(this.authMiddleware);
        router.use(requireScope(['JWT_SESSION']));

        router.route('/')
            .get(requireRole(['ADMIN']), this.getUsers.bind(this))
            .post(requireRole(['ADMIN']), this.createUser.bind(this))
            .all(methodNotAllowed);

        router.route('/password')
            .patch(this.changePassword.bind(this))
            .all(methodNotAllowed);

        router.route('/:id')
            .delete(requireRole(['ADMIN']), this.deleteUser.bind(this))
            .all(methodNotAllowed);

        router.route('/:id/role')
            .patch(requireRole(['ADMIN']), this.updateUserRole.bind(this))
            .all(methodNotAllowed);

        return router;
    }

    private async getUsers(req: Request, res: Response) {
        const requestor = res.locals.user;
        if (!requestor) {
            throw new UnauthorizedHttpError('User not found in session');
        }

        const users = await this.usersService.getUsers(requestor.id);

        res.status(200).json(users);
    }

    private async createUser(req: Request, res: Response) {
        const requestor = res.locals.user;
        if (!requestor) {
            throw new UnauthorizedHttpError('User not found in session');
        }

        const dto = parseObject(CreateUserDto, req.body);
        const user = await this.usersService.createUser(dto);

        res.status(201).json({
            id: user.id,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role: user.role
        });
    }

    private async changePassword(req: Request, res: Response) {
        const dto = parseObject(ChangePasswordBodyDto, req.body);
        const user = res.locals.user;

        if (!user) {
            throw new UnauthorizedHttpError('User not found in session');
        }

        await this.usersService.changePassword({
            username: user.username,
            password: dto.password,
            newPassword: dto.newPassword
        });

        res.sendStatus(204);
    }

    private async deleteUser(req: Request, res: Response) {
        const requestor = res.locals.user;
        if (!requestor) {
            throw new UnauthorizedHttpError('User not found in session');
        }

        const userId = req.params.id;

        // Prevent user from deleting themselves
        if (requestor.id === userId) {
            throw new ForbiddenHttpError('You cannot delete your own account');
        }

        await this.usersService.deleteUser(userId);

        res.sendStatus(204);
    }

    private async updateUserRole(req: Request, res: Response) {
        const requestor = res.locals.user;
        if (!requestor) {
            throw new UnauthorizedHttpError('User not found in session');
        }

        const userId = req.params.id;

        // Prevent user from changing their own role
        if (requestor.id === userId) {
            throw new ForbiddenHttpError('You cannot change your own role');
        }

        const dto = parseObject(UpdateUserRoleDto, req.body);

        const updatedUser = await this.usersService.updateUserRole({
            userId,
            role: dto.role
        });

        res.status(200).json({
            id: updatedUser.id,
            username: updatedUser.username,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    }
}

class CreateUserDto {
    @StringProperty()
    readonly username!: string;

    @StringProperty()
    readonly password!: string;

    @EnumProperty(UserRole, {isOptional: true, defaultValue: UserRole.USER})
    readonly role?: UserRole;
}


class ChangePasswordBodyDto {
    @StringProperty()
    readonly password!: string;

    @StringProperty()
    readonly newPassword!: string;
}

class UpdateUserRoleDto {
    @EnumProperty(UserRole)
    readonly role!: UserRole;
}
