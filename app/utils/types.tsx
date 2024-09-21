export enum Action_Type {
    USER_TOKEN = "USER_TOKEN",
    USER_PROFILE = "USER_PROFILE",
    LOGOUT_USER = "LOGOUT_USER"
}

export type User = {
    id: string,
    name: string,
    email: string,
    role: user_role,
}

export enum user_role {
    team = "team",
    admin = "admin"
}

export interface UserContextType {
    isLoggedIn: boolean,
    user: User | null,
    userDispatch: React.Dispatch<{ payload?: any, type: Action_Type }>
}

export type Task = {
    id: string;
    name: string;
    details: string | null;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
}
export type Project = {
    id: string;
    name: string;
    details: string | null;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
}