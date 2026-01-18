// CRITICAL: i18n must be imported FIRST, before any React components
import "./i18n/config";

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { checkCacheVersion } from "./lib/cache-utils";

// Check and clear outdated cache on app load
checkCacheVersion();

createRoot(document.getElementById("root")!).render(<App />);
