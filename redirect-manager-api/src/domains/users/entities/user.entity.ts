export type UserEntity = {
    id: string;
    username: string;
    /**
     * Hashed password.
     */
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: 'USER' | 'ADMIN';
}

