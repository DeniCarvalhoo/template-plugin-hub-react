// import "./index.css";
import { EmissionTable, RefreshButton } from "@/plugins";
import { meta as emissionTableMeta } from "@/plugins/emissions-table/meta";
import { meta as refreshButtonMeta } from "@/plugins/refreshButton/meta";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

// Lista de plugins com seus componentes e metadata
const plugins = [
  { Component: RefreshButton, meta: refreshButtonMeta },
  { Component: EmissionTable, meta: emissionTableMeta },
];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="hub:min-h-screen hub:bg-gray-50 hub:p-6">
      <div className="hub:max-w-7xl hub:mx-auto">
        {/* Header */}
        <div className="hub:mb-8">
          <h1 className="hub:text-3xl hub:font-bold hub:text-gray-900 hub:mb-2">
            Plugin Preview Hub
          </h1>
          <p className="hub:text-gray-600">
            Visualização de todos os plugins disponíveis no projeto
          </p>
        </div>

        {/* Plugins Grid */}
        <div className="hub:grid hub:grid-cols-1 hub:lg:hub:grid-cols-2 hub:gap-6">
          {plugins.map(({ Component, meta }) => (
            <div
              key={meta.id}
              className="hub:bg-white hub:rounded-lg hub:shadow-sm hub:border hub:border-gray-200 hub:overflow-hidden"
            >
              {/* Plugin Header */}
              <div className="hub:bg-gray-50 hub:px-6 hub:py-4 hub:border-b hub:border-gray-200">
                <div className="hub:flex hub:items-center hub:justify-between">
                  <div>
                    <h2 className="hub:text-lg hub:font-semibold hub:text-gray-900">
                      {meta.displayName}
                    </h2>
                    <p className="hub:text-sm hub:text-gray-600 hub:mt-1">
                      {meta.description}
                    </p>
                  </div>
                  <div className="hub:text-xs hub:text-gray-500">
                    v{meta.version}
                  </div>
                </div>

                {/* Tags */}
                {meta.tags && meta.tags.length > 0 && (
                  <div className="hub:flex hub:flex-wrap hub:gap-2 hub:mt-3">
                    {meta.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="hub:inline-flex hub:items-center hub:px-2 hub:py-1 hub:rounded-full hub:text-xs hub:font-medium hub:bg-blue-100 hub:text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Plugin Content */}
              <div className="hub:p-6">
                <Component />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="hub:mt-12 hub:text-center hub:text-gray-500 hub:text-sm">
          Total de plugins: {plugins.length}
        </div>
      </div>
    </div>
  </StrictMode>,
);
