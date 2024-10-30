import { UserReviewType } from '@/types';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

type PubViewContext = {
    calculateWithinScrollBounds: (withAnimation: boolean) => void; // A function to ensure changes in layout haven't meant we are now viewing outside of the viewport (i.e. see less on comments)

    reviews: UserReviewType[];
    setReviews: Dispatch<SetStateAction<UserReviewType[]>>;
    userReview: UserReviewType | null;
    setUserReview: Dispatch<SetStateAction<UserReviewType | null>>;
};

export const PubViewContext = createContext<PubViewContext | null>(null);

export const useSharedPubViewContext = () => {
    const context = useContext(PubViewContext);

    if (!context) {
        throw "'useSharedPubViewContext' must be used within PubViewContext";
    }
    return context;
};
