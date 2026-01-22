// CRITICAL: i18n must be imported FIRST, before any React components
import "./i18n/config";

import { ViteSSG } from "vite-plugin-ssg/react";
import { createRoutesFromElements } from "react-router-dom";
import "./index.css";
import { checkCacheVersion } from "./lib/cache-utils";
import { AppRoutes } from "./routes";
import App from "./App";

export const createApp = ViteSSG(
  App,
  {
    routes: createRoutesFromElements(<AppRoutes />),
    base: import.meta.env.BASE_URL,
    includedRoutes: (paths) => paths.filter((path) => !path.includes(":")),
  },
  ({ isClient }) => {
    if (isClient) {
      checkCacheVersion();
    }
  }
);
