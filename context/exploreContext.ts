import { Dispatch, SetStateAction, createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

type ExploreContext = {
    filterBarHeight: number;
    setFilterBarHeight: Dispatch<SetStateAction<number>>;
    mapBottomSheetAnimatedValue: SharedValue<number>;
};

export const ExploreContext = createContext<ExploreContext | null>(null);

export const useSharedExploreContext = () => {
    const context = useContext(ExploreContext);

    if (!context) {
        throw "'useSharedExploreContext' must be used within ExploreContext";
    }
    return context;
};
