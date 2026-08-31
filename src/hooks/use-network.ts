import { useContext } from "react";
import {
  NetworkContext,
  type NetworkProps,
} from "@/providers/network-provider";

export function useNetwork(): NetworkProps {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
