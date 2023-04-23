import { RefObject, createContext, useContext } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

interface BottomSheetContextType {
    translateY: Animated.SharedValue<number>;
    moving: Animated.SharedValue<boolean>;
    isExpanded: Animated.SharedValue<boolean>;
    scrollY: Animated.SharedValue<number>;
    scrollableRef: RefObject<ScrollView>;
}

export const BottomSheetContext = createContext<BottomSheetContextType | null>(
    null,
);

export const useSharedBottomSheetContext = () => {
    const context = useContext(BottomSheetContext);

    if (!context) {
        throw "'useSharedBottomSheetContext' must be used within bottom sheet.";
    }

    return context;
};
