import { CollectionType } from '@/services/queries/collections';
import { UserType } from '@/services/queries/user';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
    CompositeScreenProps,
    NavigatorScreenParams,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

type ProfileNavigatorStackParamList = {
    ProfileHome: undefined;
    Notifications: undefined;
};

export type ProfileNavigatorScreenProps<
    T extends keyof ProfileNavigatorStackParamList,
> = CompositeScreenProps<
    StackScreenProps<ProfileNavigatorStackParamList, T>,
    HomeNavigatorBottomTabProps<keyof HomeNavigatorBottomTabParamList>
>;

type SavedNavigatorStackParamList = {
    SavedHome: undefined;
    CollectionsHome: undefined;
    CollectionView: {
        collectionId: number;
    };
};

export type SavedNavigatorScreenProps<
    T extends keyof SavedNavigatorStackParamList,
> = CompositeScreenProps<
    StackScreenProps<SavedNavigatorStackParamList, T>,
    HomeNavigatorBottomTabProps<keyof HomeNavigatorBottomTabParamList>
>;

type HomeNavigatorBottomTabParamList = {
    Explore: undefined;
    Favourites: NavigatorScreenParams<SavedNavigatorStackParamList>;
    LoggedInProfile: NavigatorScreenParams<ProfileNavigatorStackParamList>;
    Feed: undefined;
};

export type HomeNavigatorBottomTabProps<
    T extends keyof HomeNavigatorBottomTabParamList,
> = CompositeScreenProps<
    BottomTabScreenProps<HomeNavigatorBottomTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
>;

export type RootStackParamList = {
    Home: NavigatorScreenParams<HomeNavigatorBottomTabParamList>;
    PubView: {
        pubId: number;
        onSaveToggle?: (id: number, value: boolean) => void;
    };
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
        name: string;
        primary_photo: string | null;
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
    SelectPub: {
        header: string;
        excludedIds: number[];
        onAdd: (pub: {
            id: number;
            name: string;
            primary_photo: string | null;
        }) => void;
    };
    UserActivity: {
        userId: string;
    };
    CreateCollection?: {
        withPub: { id: number; name: string; primary_photo: string | null };
    };
    EditCollection: {
        collection: CollectionType;
    };
    UserRatings: {
        userId: string;
    };
    UserReviews: {
        userId: string;
    };
    AddCollaborator: {
        excludedIds: string[];
        onAdd: (user: {
            id: string;
            username: string;
            profile_photo: string | null;
        }) => void;
    };
    CollectionComments: {
        collectionId: number;
        focusOnOpen?: boolean;
    };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    StackScreenProps<RootStackParamList, T>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}
