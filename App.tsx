import { Initialize } from "@/initialize";
import { Providers } from "@/providers";
import { Routes } from "@/routes";
import "./global.css";

export default function App() {
  return (
    <Initialize>
      <Providers>
        <Routes />
      </Providers>
    </Initialize>
  );
}
