import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type MessageId = string;
export interface Message {
    id: MessageId;
    content: string;
    position: bigint;
}
export type PictureId = string;
export interface UserProfile {
    name: string;
}
export interface Picture {
    id: PictureId;
    title: string;
    blob: ExternalBlob;
    description: string;
    position: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(content: string, position: bigint): Promise<void>;
    addPicture(blob: ExternalBlob, title: string, description: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMessage(id: MessageId): Promise<void>;
    deletePicture(id: PictureId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessages(): Promise<Array<Message>>;
    getPictures(): Promise<Array<Picture>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    reorderMessages(orderedIds: Array<MessageId>): Promise<void>;
    reorderPictures(orderedIds: Array<PictureId>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMessage(id: MessageId, content: string, position: bigint): Promise<void>;
    updatePicture(id: PictureId, blob: ExternalBlob, title: string, description: string): Promise<void>;
}
