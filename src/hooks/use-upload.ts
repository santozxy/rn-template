import { useContext } from "react";
import { UploadContext } from "@/providers/upload-provider";

export function useUpload() {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error("useUpload deve ser usado dentro de um UploadProvider");
  }

  return context;
}
