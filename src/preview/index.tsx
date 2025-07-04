// import "./index.css";
import { EmissionTable, RefreshButton } from "@/plugins";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="hub:p-4 hub:w-full hub:flex hub:flex-col hub:items-start hub:justify-center hub:gap-4">
      <RefreshButton />
      <div className="hub:w-full hub:h-0.5 hub:bg-black/15"></div>
      <EmissionTable />
    </div>
  </StrictMode>,
);
