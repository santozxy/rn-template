import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

interface CarouselProps {
  images: { id: string; url: string }[];
  leftComponent?: React.ReactNode;
}

export function Carousel({ images, leftComponent }: CarouselProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const modalFlatListRef = useRef<FlatList>(null);
  const carouselWidth = containerWidth || windowWidth;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageWidth = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    setCurrentIndex(index);
  };

  const openImage = useCallback((index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
    setTimeout(() => {
      modalFlatListRef.current?.scrollToIndex({ index, animated: false });
    }, 0);
  }, []);

  const closeImage = () => {
    setModalVisible(false);
  };

  const renderItem = useCallback(
    ({ item, index }: { item: { id: string; url: string }; index: number }) => (
      <Button
        variant="unstyled"
        size="content"
        activeOpacity={0.9}
        onPress={() => openImage(index)}
      >
        <Image
          source={{ uri: item.url }}
          style={{ width: carouselWidth, height: 256 }}
          contentFit="cover"
        />
      </Button>
    ),
    [carouselWidth, openImage],
  );

  const renderItemFullImage = useCallback(
    ({ item }: { item: { id: string; url: string } }) => (
      <Image
        source={item.url}
        style={{ width: windowWidth, height: windowHeight }}
        contentFit="contain"
      />
    ),
    [windowHeight, windowWidth],
  );

  return (
    <View
      className="relative"
      onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
    >
      <FlatList
        key={`carousel-${carouselWidth}`}
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />

      <View className="absolute bottom-2 right-4 rounded-full bg-black/60 px-3 py-1">
        <Text className="font-bold text-sm text-white">
          {currentIndex + 1}/{images.length}
        </Text>
      </View>
      {leftComponent && (
        <View className="absolute bottom-2 left-4">{leftComponent}</View>
      )}

      <Modal visible={modalVisible} transparent={true} ref={modalFlatListRef}>
        <View className="flex-1 bg-black/90">
          <Button
            variant="unstyled"
            size="content"
            onPress={closeImage}
            className="absolute right-2 top-32 z-50 flex-row items-center rounded-full bg-zinc-500/30 px-3 py-1"
          >
            <Text className="mr-1 text-lg text-white">✕</Text>
            <Text className="text-white">Fechar</Text>
          </Button>
          <FlatList
            key={`carousel-modal-${windowWidth}`}
            ref={modalFlatListRef}
            data={images}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentIndex}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            renderItem={renderItemFullImage}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            onScrollToIndexFailed={(info) => {
              setTimeout(() => {
                modalFlatListRef.current?.scrollToOffset({
                  offset: info.index * windowWidth,
                  animated: false,
                });
              }, 100);
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
