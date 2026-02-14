import {UserEntity} from "../entities";
import {UserRole} from "../../../generated/prisma/enums";

export interface CreateUserDto {
    readonly username: string;
    readonly password: string;
    readonly role?: UserRole;
}

export interface ChangePasswordDto {
    readonly username: string;
    readonly password: string;
    readonly newPassword: string;
}

export interface UpdateUserRoleDto {
    readonly userId: string;
    readonly role: UserRole;
}

export type User = Pick<UserEntity, 'id' | 'username' | 'createdAt' | 'updatedAt' | 'password' | 'role'>;

export type UserListItem = Pick<UserEntity, 'id' | 'username' | 'role' | 'createdAt' | 'updatedAt'>;

