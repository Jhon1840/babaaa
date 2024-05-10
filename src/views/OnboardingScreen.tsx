import {StyleSheet, View, FlatList, ViewToken} from 'react-native';
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useDerivedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import OnboardingData, { OnboardingDataI } from '@/constants/OnboardingData';
import OnboardingItem from '@/components/OnboardingItem';
import Pagination from '@/components/Pagination';
import { Button, ButtonText } from '@gluestack-ui/themed';


interface OnboardingScreenProps {
  onFinish: () => void
}

const OnboardingScreen = ({
  onFinish
}: OnboardingScreenProps) => {
  const flatListRef = useAnimatedRef<FlatList<OnboardingDataI>>();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const onViewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems[0].index !== null) {
      flatListIndex.value = viewableItems[0].index;
    }
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const isLastSlide = useDerivedValue(() => {
    return flatListIndex.value === OnboardingData.length - 1;
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      opacity: isLastSlide.value ? 1 : 0,
    };
  });
  
  

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={OnboardingData}
        renderItem={({item, index}) => {
          return <OnboardingItem item={item} index={index} x={x} />;
        }}
        keyExtractor={item => item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={OnboardingData} x={x} />
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Button
            size={"xl"}
            borderRadius={'$xl'}
            backgroundColor={'$blue600'}
            onPress={() => onFinish()}
            $hover={{ opacity: '$10' }}
          >
            <ButtonText>Iniciar</ButtonText>
          </Button>
        </Animated.View>
        
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },  
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    paddingVertical: 30,
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
});