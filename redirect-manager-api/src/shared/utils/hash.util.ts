import bcrypt from 'bcrypt';

export function hashPassword(password: string, saltRounds: number): string {
    return bcrypt.hashSync(password, saltRounds);
}

export function compareHash({secret, hashed}: { secret: string, hashed: string }): boolean {
    return bcrypt.compareSync(secret, hashed);
}

