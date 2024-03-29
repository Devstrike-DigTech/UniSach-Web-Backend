import Drug from "./drug.interface";


export default interface DrugRepositoryInterface {
    create(...data: drug.Request[]): Promise<drug.Response>
    find(query: any): Promise<find.Response>
    findOne(query: any): Promise<findOneN.Response>
    updateDoc(...data: updateDoc.Request[]): Promise<updateDoc.Response>
    deleteDoc(...ids: string[]): Promise<deleteDoc.Response>
}

interface Res {
    insertedCount: number,
    matchedCount: number,
    modifiedCount: number,
    deletedCount: number,
}

export namespace drug {
    export type Request = Omit<Drug, 'id' | 'slug'>;
    export type Response = Drug[];
}

export namespace findOneN {
    export type Request = Drug | any;
    export type Response = Drug | null;
}

export namespace find {
    export type Response = Drug[] | [];
}

export namespace updateDoc {
    export type Request = Omit<Drug, 'slug'>;
    export type Response = Res;
}

export namespace deleteDoc {
    export type Response = ResizeObserver;
}

export interface DeleteInterfaceDrug {
    deleteOne: {filter: {_id: string}}
}

export interface UpdateInterfaceDrug {
    updateOne: {filter: {_id: string}, update: Omit<Drug, 'slug'>}
}