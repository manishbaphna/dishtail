import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;
const basename = import.meta.env.BASE_URL === "/dishtail/" ? "/dishtail" : "/";

createRoot(container).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
