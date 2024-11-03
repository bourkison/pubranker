export type ListCollectionType = {
    id: number;
    name: string;
    pubs: {
        id: number;
        primary_photo: string | null;
    }[];
    pubs_count: {
        count: number;
    }[];
};
