// https://github.com/bourkison/pubranker/blob/8dfb1eaf13dab7a26496f85dbc210fce219c9710/components/BottomBar/BottomBarAnimated.tsx
// https://www.altogic.com/blog/passing-data-from-parent-to-child-in-react#context-api-and-state
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedProps,
    useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { useSharedBottomSheetContext } from '@/components/BottomSheet/context';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

type BottomSheetScrollViewProps = {
    children: JSX.Element;
};

export default function BottomSheetScrollView({
    children,
}: BottomSheetScrollViewProps) {
    const { isExpanded, moving, scrollY, scrollableRef } =
        useSharedBottomSheetContext();

    const scrollHandler = useAnimatedScrollHandler(({ contentOffset }) => {
        scrollY.value = Math.round(contentOffset.y);

        console.log(scrollY.value - contentOffset.y);
    });

    const scrollProps = useAnimatedProps(() => {
        return {
            // only scroll if sheet is open
            scrollEnabled: isExpanded.value,
            // only bounce at bottom or not touching screen
            bounces: !(scrollY.value <= 0 || moving.value),
        };
    });

    // const scrollTo = useCallback(
    //     (y: number) => {
    //         if (scrollRef && scrollRef.current) {
    //             scrollRef?.current.scrollTo({
    //                 y: y,
    //                 animated: false,
    //             });
    //         }
    //     },
    //     [scrollRef],
    // );

    return (
        <AnimatedScrollView
            scrollEventThrottle={1}
            ref={scrollableRef}
            onScroll={scrollHandler}
            animatedProps={scrollProps}>
            {children}
        </AnimatedScrollView>
    );
}
