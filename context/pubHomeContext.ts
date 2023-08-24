import { UserReviewType } from '@/types';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

type PubHomeContextType = {
    calculateWithinScrollBounds: (withAnimation: boolean) => void; // A function to ensure changes in layout haven't meant we are now viewing outside of the viewport (i.e. see less on comments)

    reviews: UserReviewType[];
    setReviews: Dispatch<SetStateAction<UserReviewType[]>>;
    isLoadingReviews: boolean;
    setIsLoadingReviews: Dispatch<SetStateAction<boolean>>;
};

export const PubHomeContext = createContext<PubHomeContextType | null>(null);

export const useSharedPubHomeContext = () => {
    const context = useContext(PubHomeContext);

    if (!context) {
        throw "'useSharedPubHomeContext' must be used within PubHomeContext";
    }
    return context;
};
