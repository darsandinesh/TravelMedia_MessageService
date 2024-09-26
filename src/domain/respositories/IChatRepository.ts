import { IChat } from "../entities/IChat";

export interface IChatRepository {
    find(userId:string): Promise<{success:boolean, message:string, data?:IChat[]}>
}