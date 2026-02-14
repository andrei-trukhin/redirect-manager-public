import {UniqueConstraintError} from "../../../shared";
import {UsersRepository} from "../repositories";
import {UserEntity} from "../entities";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";

export class UsersPrismaRepository implements UsersRepository {

    constructor(private readonly client: any) {
    }

    findById(id: string): Promise<UserEntity | null> {
        return this.client.user.findUnique({where: {id}});
    }

    findByUsername(username: string): Promise<UserEntity | null> {
        return this.client.user.findUnique({where: {username}});
    }

    async save(user: { username: string; hashedPassword: string; role?: 'USER' | 'ADMIN' }): Promise<UserEntity> {
        try {
            return await this.client.user.create({
                data: {
                    username: user.username,
                    password: user.hashedPassword,
                    ...(user.role && {role: user.role})
                }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new UniqueConstraintError(`User with username ${user.username} already exists.`);
            }

            throw error;
        }
    }

    update(user: UserEntity): Promise<UserEntity> {
        user.updatedAt = new Date();
        return this.client.user.update({
            where: {id: user.id},
            data: user
        });
    }

    async delete(id: string): Promise<void> {
        // call deleteMany to make sure the operation is idempotent,
        // as deleteMany will not throw if the user does not exist
        await this.client.user.deleteMany({
            where: {id}
        });
    }

    findAll(): Promise<UserEntity[]> {
        return this.client.user.findMany();
    }

}

