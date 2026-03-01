import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface PublicUserProfile {
    username: string;
    createdAt: Time;
}
export interface CreatorProfile {
    id: bigint;
    bio: string;
    distanceLabel: Type;
    name: string;
    avatarUrl: string;
    category: Type__1;
}
export interface UserProfile {
    name: string;
}
export enum Type {
    neighborhood = "neighborhood",
    hyperlocal = "hyperlocal",
    cityWide = "cityWide"
}
export enum Type__1 {
    art = "art",
    music = "music",
    food = "food",
    crafts = "crafts",
    wellness = "wellness",
    fashion = "fashion"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCreator(creator: CreatorProfile): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllCreators(): Promise<Array<CreatorProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreatorsByCategory(category: Type__1): Promise<Array<CreatorProfile>>;
    getCreatorsByDistanceLabel(distanceLabel: Type): Promise<Array<CreatorProfile>>;
    getUserCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProfileByUsername(username: string): Promise<PublicUserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    loginUser(username: string, _password: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    registerUser(username: string, password: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: string;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
