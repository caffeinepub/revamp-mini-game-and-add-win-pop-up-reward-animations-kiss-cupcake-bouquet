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
export type TreatId = string;
export interface Picture {
    id: PictureId;
    title: string;
    blob: ExternalBlob;
    description: string;
    position: bigint;
}
export interface SweetTreat {
    id: TreatId;
    name: string;
    description: string;
    position: bigint;
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
export interface UnlockCount {
    messages: bigint;
    treats: bigint;
    pictures: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(content: string, position: bigint): Promise<void>;
    addPicture(blob: ExternalBlob, title: string, description: string): Promise<void>;
    addSweetTreat(name: string, description: string, position: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteMessage(id: MessageId): Promise<void>;
    deletePicture(id: PictureId): Promise<void>;
    deleteSweetTreat(id: TreatId): Promise<void>;
    getAllMessages(): Promise<Array<Message>>;
    getAllPictures(): Promise<Array<Picture>>;
    getAllTreats(): Promise<Array<SweetTreat>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUnlockedMessages(): Promise<Array<Message>>;
    getUnlockedPictures(): Promise<Array<Picture>>;
    getUnlockedTreats(): Promise<Array<SweetTreat>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    incrementUnlocks(unlockTreats: boolean, unlockMessages: boolean, unlockPictures: boolean): Promise<UnlockCount>;
    isCallerAdmin(): Promise<boolean>;
    reorderMessages(orderedIds: Array<MessageId>): Promise<void>;
    reorderPictures(orderedIds: Array<PictureId>): Promise<void>;
    reorderSweetTreats(orderedIds: Array<TreatId>): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMessage(id: MessageId, content: string, position: bigint): Promise<void>;
    updatePicture(id: PictureId, blob: ExternalBlob, title: string, description: string): Promise<void>;
    updateSweetTreat(id: TreatId, name: string, description: string, position: bigint): Promise<void>;
}
