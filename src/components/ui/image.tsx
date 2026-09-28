import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from "expo-image";

type ImageProps = ExpoImageProps;

export function Image(props: ImageProps) {
  return (
    <ExpoImage
      key={props.source?.toString()}
      enforceEarlyResizing={true}
      contentFit={props.contentFit || "cover"}
      cachePolicy={"memory-disk"}
      priority={"high"}
      {...props}
    />
  );
}
