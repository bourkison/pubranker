import { createContext, useContext } from 'react';

type CollectionContext = {
    showAddToCollection: (id: number, duration?: number) => void;
    setIsOnBottomTabsPage: (isOnBottomTabs: boolean) => void;
    setBottomTabHeight: (height: number) => void;
};

export const CollectionContext = createContext<CollectionContext | null>(null);

export const useSharedCollectionContext = () => {
    const context = useContext(CollectionContext);

    if (!context) {
        throw "'useSharedCollectionContext' must be used within CollectionContext";
    }
    return context;
};