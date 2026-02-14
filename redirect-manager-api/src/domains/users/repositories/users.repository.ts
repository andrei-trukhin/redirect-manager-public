import {UserEntity} from "../entities";

export interface UsersRepository {
    /**
     * Find a user by username.
     * @param username - Username to search for.
     */
    findByUsername(username: string): Promise<UserEntity | null>;

    /**
     * Save user.
     * @param user - User to save: username and hashed password.
     */
    save(user: {
        username: string,
        hashedPassword: string,
        role?: 'USER' | 'ADMIN'
    }): Promise<UserEntity>;

    /**
     * Find user by id.
     * @param id - User id.
     */
    findById(id: string): Promise<UserEntity | null>;

    /**
     * Update user.
     * @param user - User to update.
     */
    update(user: UserEntity): Promise<UserEntity>;

    /**
     * Delete user by id.
     * @param id - User id to delete.
     */
    delete(id: string): Promise<void>;

    /**
     * Find all users.
     */
    findAll(): Promise<UserEntity[]>;
}

