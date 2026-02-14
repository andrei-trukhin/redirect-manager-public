import {User} from "../../../users";

export type IssueRefreshTokenResult = {
    refreshToken: string;
    expiresIn: number;
}

export type IssueJwtResult = {
    jwt: string;
    expiresIn: number;
}
export type LoginResult = {
    user: User;
    jwt: IssueJwtResult;
    refreshToken: IssueRefreshTokenResult;
};