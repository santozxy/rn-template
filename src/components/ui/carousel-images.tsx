import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import React, { useCallback } from "react";
import { FlatList, Modal, useWindowDimensions } from "react-native";

interface CarouselImagesProps {
  images: string[];
}
export function CarouselImages({ images }: CarouselImagesProps) {
  const { width, height } = useWindowDimensions();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const openImage = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem = useCallback(({ item }: { item: string }) => {
    return (
      <Button variant="unstyled" size="content" onPress={() => openImage(item)}>
        <Image
          source={{ uri: item }}
          style={{
            width: 100,
            height: 100,
            marginRight: 8,
            borderRadius: 12,
          }}
        />
      </Button>
    );
  }, []);

  if (!images || images.length === 0) return null;

  return (
    <View>
      {/* Miniaturas / Carrossel */}
      <FlatList
        data={images}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item + index}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
      />

      {/* Modal da imagem ampliada */}
      <Modal visible={modalVisible} transparent onRequestClose={closeModal}>
        <View className="flex-1 items-center justify-center bg-black/90">
          <Button
            variant="unstyled"
            size="content"
            onPress={closeModal}
            className="absolute right-5 top-10 z-10"
          >
            <Text className="text-lg text-white">Fechar</Text>
          </Button>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: width * 0.9,
                height: height * 0.7,
                borderRadius: 16,
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
