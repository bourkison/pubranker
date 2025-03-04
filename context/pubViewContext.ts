import { ListCollectionType } from '@/services/queries/collections';
import { ListReviewType } from '@/services/queries/review';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

type PubViewContext = {
    reviews: ListReviewType[];
    setReviews: Dispatch<SetStateAction<ListReviewType[]>>;
    userReview: ListReviewType | null;
    setUserReview: Dispatch<SetStateAction<ListReviewType | null>>;
    hasLoadedReviews: boolean;
    setHasLoadedReviews: Dispatch<SetStateAction<boolean>>;

    collections: ListCollectionType[];
    setCollections: Dispatch<SetStateAction<ListCollectionType[]>>;
    hasLoadedCollections: boolean;
    setHasLoadedCollections: Dispatch<SetStateAction<boolean>>;
};

export const PubViewContext = createContext<PubViewContext | null>(null);

export const useSharedPubViewContext = () => {
    const context = useContext(PubViewContext);

    if (!context) {
        throw "'useSharedPubViewContext' must be used within PubViewContext";
    }

    return context;
};
