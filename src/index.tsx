import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/globals.css";
import { initSentry } from "./lib/utils";
import { ThemeProvider } from "./contexts/ThemeContext";

initSentry();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento root não encontrado no index.html");
}
createRoot(rootElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
