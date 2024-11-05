import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { createContext, useContext } from 'react';

type CollectionContext = {
    showAddToCollection: (id: number, duration?: number) => void;
    setIsOnBottomTabsPage: (isOnBottomTabs: boolean) => void;
    setBottomTabHeight: (height: number) => void;
    setNavigation: (
        navigation: StackScreenProps<
            MainNavigatorStackParamList,
            'Home'
        >['navigation'],
    ) => void;
};

export const CollectionContext