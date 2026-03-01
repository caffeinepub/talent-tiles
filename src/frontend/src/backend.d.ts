import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreatorProfile {
    id: bigint;
    bio: string;
    distanceLabel: Type;
    name: string;
    avatarUrl: string;
    category: Type__1;
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
    getCallerUserRole(): Promise<UserRole>;
    getCreatorsByCategory(category: Type__1): Promise<Array<CreatorProfile>>;
    getCreatorsByDistanceLabel(distanceLabel: Type): Promise<Array<CreatorProfile>>;
    isCallerAdmin(): Promise<boolean>;
}
