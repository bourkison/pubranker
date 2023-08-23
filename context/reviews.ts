import { UserReviewType } from '@/types';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

type ReviewContextType = {
    reviews: UserReviewType[];
    setReviews: Dispatch<SetStateAction<UserReviewType[]>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const ReviewContext = createContext<ReviewContextType | null>(null);

export const useSharedReviewContext = () => {
    const context = useContext(ReviewContext);

    if (!context) {
        throw "'useSharedReviewContext' must be used within ReviewContext.";
    }

    return context;
};
