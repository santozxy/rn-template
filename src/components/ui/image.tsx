import React from "react";
import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from "expo-image";

type ImageProps = ExpoImageProps;

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export function Image(props: ImageProps) {
  return (
    <ExpoImage
      placeholder={{ blurhash }}
      transition={800}
      key={props.source?.toString()}
      enforceEarlyResizing={true}
      contentFit={props.contentFit || "cover"}
      cachePolicy={"memory-disk"}
      priority={"high"}
      {...props}
    />
  );
}
