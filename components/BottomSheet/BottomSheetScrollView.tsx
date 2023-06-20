// https://github.com/bourkison/pubranker/blob/8dfb1eaf13dab7a26496f85dbc210fce219c9710/components/BottomBar/BottomBarAnimated.tsx
// https://www.altogic.com/blog/passing-data-from-parent-to-child-in-react#context-api-and-state
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedProps,
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedRef,
} from 'react-native-reanimated';
import { useSharedBottomSheetContext } from '@/components/BottomSheet/context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type BottomSheetScrollViewProps = {
    children: JSX.Element;
};

export default function BottomSheetScrollView({
    children,
}: BottomSheetScrollViewProps) {
    const { isExpanded, scrollY, setScrollableRefs, scrollViewIsAnimating } =
        useSharedBottomSheetContext();

    const localScrollY = useSharedValue(0);
    const localRef = useAnimatedRef<ScrollView>();

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
        scrollY.value = Math.round(contentOffset.y);
        localScrollY.value = scrollY.value;
    });

    const scrollProps = useAnimatedProps(() => {
        // console.log(localScrollY.value, !(localScrollY.value <= 0));

        return {
            // only scroll if sheet is open
            scrollEnabled: isExpanded.value,
            // only bounce at bottom
            bounces: !(localScrollY.value <= 0),
        };
    });

    // On focus reset all values
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            scrollY.value = localScrollY.value;
        });

        return unsubscribe;
    }, [scrollY, localScrollY, navigation]);

    // Push this ref on load, and pop on unload.
    useEffect(() => {
        setScrollableRefs(scrollableRefs => [...scrollableRefs, localRef]);

        return () =>
            setScrollableRefs(scrollableRefs => {
                return scrollableRefs.slice(0, -1);
            });
    }, [localRef, setScrollableRefs]);

    return (
        <AnimatedScrollView
            scrollEventThrottle={1}
            ref={localRef}
            onScrollBeginDrag={() => (scrollViewIsAnimating.value = true)}
            onScrollEndDrag={() => (scrollViewIsAnimating.value = false)}
            onScroll={scrollHandler}
            animatedProps={scrollProps}>
            {children}
        </AnimatedScrollView>
    );
}
