import { PubSchema } from '@/types';
import { createContext, useContext } from 'react';

type PubRPIContextType = {
    pub: PubSchema;
};

export const PubRPIContext = createContext<PubRPIContextType | null>(null);

export const usePubRPIContext = () => {
    const context = useContext(PubRPIContext);

    if (!context) {
        throw "'usePubRPIContext' must be used within the Pub RPI Top Tabs.";
    }

    return context;
};
