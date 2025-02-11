import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Home: NavigatorScreenParams<BottomTabNavigatorParamList>;
    PubView: {
        pubId: number;
        onSaveToggle?: (id: number, value: boolean) => void;
    };
    Suggestions: { pub: PubSchema };
    CreateReview: {
        pubId: number;
    };
    ViewReview: {
        reviewId: number;
    };
    CreateComment: {
        reviewId: number;
        onCreate: (comment: Tables<'comments'>) => void;
    };
    AddToList: {
        pubId: number;
    };
    Profile: {
        userId: string;
    };
    UserCollections: {
        userId: string;
    };
    UserCollectionView: {
        collectionId: number;
    };
    FollowersFollowingView: {
        userId: string;
        type: 'followers' | 'following';
        count: number;
    };
    Settings: {
        username: string;
        name: string;
        email: string;
        location: string;
        bio: string;
        profile_photo: string;
        favourites: UserType['favourites'];
    };
    AddFavourite: {
        favourites: UserType['favourites'];
        onAdd: (pub: UserType['favourites'][number]) => void;
    };
};

type BottomTabNavigatorParamList = {
    Explore: undefined;
    Favourites: NavigatorScreenParams<SavedNavigatorStackParamList>;
    LoggedInProfile: NavigatorScreenParams<ProfileNavigatorStackParamList>;
    Feed: undefined;
};

type ProfileNavigatorStackParamList = {
    ProfileHome: undefined;
    Notifications: undefined;
};

type SavedNavigatorStackParamList = {
    SavedHome: undefined;
    CollectionsHome: undefined;
    CollectionView: {
        collectionId: number;
    };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
