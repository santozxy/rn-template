import { toast } from "@/lib/toast";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import React, { createContext, ReactNode, useCallback } from "react";

export type UploadResult = {
  uri: string;
  name?: string;
  base64?: string;
  mimeType?: string;
  size?: number;
};

export type PickDocumentOptions = {
  type?: string | string[];
};

export type UploadContextData = {
  pickImageFromLibrary: (
    selectionLimit: number,
  ) => Promise<UploadResult[] | undefined>;
  pickImageFromCamera: () => Promise<UploadResult | undefined>;
  pickDocument: (
    options?: PickDocumentOptions,
  ) => Promise<UploadResult | undefined>;
};

export const UploadContext = createContext<UploadContextData | undefined>(
  undefined,
);

export const configImage = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  base64: true,
  allowsMultipleSelection: true,
  quality: 0.1,
};

export function UploadProvider({ children }: { children: ReactNode }) {
  const pickImageFromCamera = useCallback(async (): Promise<
    UploadResult | undefined
  > => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      toast.error("O acesso à câmera é necessário.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      ...configImage,
      allowsMultipleSelection: false,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.fileName || "photo.jpg",
      mimeType: asset.mimeType || "image/jpeg",
      base64: asset.base64 || "",
    };
  }, []);

  const pickImageFromLibrary = useCallback(
    async (selectionLimit: number): Promise<UploadResult[] | undefined> => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast.error("O acesso à galeria é necessário.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        ...configImage,
        selectionLimit,
      });

      if (result.canceled) return;

      return result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || "image.jpg",
        mimeType: asset.mimeType || "image/jpeg",
        base64: asset.base64 || "",
      }));
    },
    [],
  );

  const pickDocument = useCallback(
    async (
      options?: PickDocumentOptions,
    ): Promise<UploadResult | undefined> => {
      const result = await DocumentPicker.getDocumentAsync({
        type: options?.type ?? "*/*",
        copyToCacheDirectory: true,
        multiple: false,
        base64: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      const base64 =
        file.base64 ||
        (await FileSystem.readAsStringAsync(file.uri, {
          encoding: FileSystem.EncodingType.Base64,
        }));

      return {
        uri: file.uri,
        name: file.name,
        mimeType: file.mimeType || undefined,
        size: file.size,
        base64,
      };
    },
    [],
  );

  return (
    <UploadContext.Provider
      value={{ pickImageFromLibrary, pickImageFromCamera, pickDocument }}
    >
      {children}
    </UploadContext.Provider>
  );
}
