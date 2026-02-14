import {UsersRepository} from "../repositories";
import {compareHash, hashPassword, InvalidCredentialsError} from "../../../shared";
import {UserAlreadyExistsError, UserNotFoundError} from "../errors";
import {ChangePasswordDto, CreateUserDto, UpdateUserRoleDto, User, UserListItem} from "./types";
import {AuthConfig} from "../../../config/auth.config";

export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly authConfig: AuthConfig
    ) {}

    async createUser(dto: CreateUserDto): Promise<User> {
        const {username, password, role} = dto;

        const existingUser = await this.usersRepository.findByUsername(username);
        if (existingUser) {
            throw new UserAlreadyExistsError(`User with this username ${username} already exists.`);
        }

        const hashedPassword = hashPassword(password, this.authConfig.PASSWORD_SALT_ROUNDS);
        const newUserEntity = await this.usersRepository.save({
            username,
            hashedPassword,
            ...(role && { role })
        });

        return {
            id: newUserEntity.id,
            username: newUserEntity.username,
            createdAt: newUserEntity.createdAt,
            updatedAt: newUserEntity.updatedAt,
            password: newUserEntity.password,
            role: newUserEntity.role
        };
    }

    async changePassword(dto: ChangePasswordDto): Promise<void> {
        const user = await this.usersRepository.findByUsername(dto.username);
        if (!user) {
            throw new InvalidCredentialsError('User not found.');
        }

        if (!compareHash({
            secret: dto.password,
            hashed: user.password
        })) {
            throw new InvalidCredentialsError('Invalid credentials');
        }

        user.password = hashPassword(dto.newPassword, this.authConfig.PASSWORD_SALT_ROUNDS);

        await this.usersRepository.update(user);
    }

    async findById(id: string): Promise<User | null> {
        return this.usersRepository.findById(id);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.usersRepository.findByUsername(username);
    }

    /**
     * Deletes a user by id.
     * @param id - User id to delete.
     * @throws UserNotFoundError if user is not found.
     */
    async deleteUser(id: string): Promise<void> {
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new UserNotFoundError(`User with id ${id} not found.`);
        }

        await this.usersRepository.delete(id);
    }

    /**
     * Gets a list of all users with filtered information.
     * Returns only username, role, createdAt, and updatedAt fields.
     * Excludes the current user from the list.
     * @param currentUserId - The ID of the current user to exclude from the list.
     */
    async getUsers(currentUserId: string): Promise<UserListItem[]> {
        const users = await this.usersRepository.findAll();

        return users
            .filter(user => user.id !== currentUserId)
            .map(user => ({
                id: user.id,
                username: user.username,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }));
    }

    /**
     * Updates a user's role.
     * @param dto - DTO containing userId and new role.
     * @throws UserNotFoundError if user is not found.
     */
    async updateUserRole(dto: UpdateUserRoleDto): Promise<User> {
        const user = await this.usersRepository.findById(dto.userId);
        if (!user) {
            throw new UserNotFoundError(`User with id ${dto.userId} not found.`);
        }

        user.role = dto.role;
        const updatedUser = await this.usersRepository.update(user);

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
            password: updatedUser.password,
            role: updatedUser.role
        };
    }
}
