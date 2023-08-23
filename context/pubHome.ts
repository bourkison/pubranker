import { createContext, useContext } from 'react';

type PubHomeContextType = {
    calculateWithinScrollBounds: (heightDifference: number) => void; // A function to ensure changes in layout haven't meant we are now viewing outside of the viewport (i.e. see less on comments)
};

export const PubHomeContext = createContext<PubHomeContextType | null>(null);

export const useSharedPubHomeContext = () => {
    const context = useContext(PubHomeContext);

    if (!context) {
        throw "'useSharedPubHomeContext' must be used within PubHomeContext";
    }
    return context;
};
