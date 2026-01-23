// CRITICAL: i18n must be imported FIRST, before any React components
import "./i18n/config";

import { createRoot } from "react-dom/client";
import "./index.css";
import { checkCacheVersion } from "./lib/cache-utils";
import App from "./App";

// Check cache version on app load
checkCacheVersion();

createRoot(document.getElementById("root")!).render(<App />);
