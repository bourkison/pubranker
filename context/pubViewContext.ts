import { ListReviewType } from '@/services/queries/review';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

type PubViewContext = {
    reviews: ListReviewType[];
    setReviews: Dispatch<SetStateAction<ListReviewType[]>>;
    userReview: ListReviewType | null;
    setUserReview: Dispatch<SetStateAction<ListReviewType | null>>;
};

export const PubViewContext = createContext<PubViewContext | null>(null);

export const useSharedPubViewContext = () => {
    const context = useContext(PubViewContext);

    if (!context) {
        throw "'useSharedPubViewContext' must be used within PubViewContext";
    }

    return context;
};
