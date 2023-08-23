import { UserReviewType } from '@/types';
import {
    Dispatch,
    SetStateAction,
    RefObject,
    createContext,
    useContext,
} from 'react';

interface ReviewContextType {
    reviews: RefObject<UserReviewType>[];
    setReviews: Dispatch<SetStateAction<RefObject<UserReviewType>[]>>;
    isLoading: RefObject<boolean>;
    setIsLoading: Dispatch<SetStateAction<RefObject<boolean>>>;
}

export const ReviewContext = createContext<ReviewContextType | null>(null);

export const useSharedReviewContext = () => {
    const context = useContext(ReviewContext);

    if (!context) {
        throw "'useSharedReviewContext' must be used within bottom sheet.";
    }

    return context;
};
