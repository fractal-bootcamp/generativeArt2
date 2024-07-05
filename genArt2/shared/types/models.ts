// types.ts

export interface User {
    id: number;
    name: string;
    email: string;
    clerkId: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    avatarUrl?: string | null;
    arts: Art[];
    warnsdorffs: Warnsdorff[];
}

export interface Art {
    id: number;
    bgcolor: string;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: number;
    creator: User;
}

export interface Token {
    token: string;
}

export interface Warnsdorff {
    id: string;
    boardSize: number;
    path: number[];
    gigerMode: boolean;
    createdAt: Date;
    updatedAt: Date;
    isPublished: boolean;
    isDeleted: boolean;
    creatorId: string;
    creator: User;
}