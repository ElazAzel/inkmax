import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { checkCacheVersion } from "./lib/cache-utils";

// Check and clear outdated cache on app load
checkCacheVersion();

createRoot(document.getElementById("root")!).render(<App />);
