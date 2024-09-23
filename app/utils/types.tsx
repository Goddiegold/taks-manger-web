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
    password?: string
    socketId?: string
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
    assignments: string[] | Partial<AssignedProject>[]
    num?: string,
    author: User
}

export type AssignedProject = {
    id: string;
    deadline: Date;
    userId: string;
    projectId: string;
    assignedById: string;
    project: AssignedProject,
    assignedBy: User;
    createdAt: Date;
    updatedAt: Date;
}

export enum notification_type {
    assigned_to_task = "assigned_to_task",
    assigned_to_project = "assigned_to_project",
    updated_task = "updated_task",
    updated_project = "updated_project",
}