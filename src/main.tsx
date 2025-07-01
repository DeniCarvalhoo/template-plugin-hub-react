import Component from "./Component.tsx";
// import "./index.css";
import styleText from "./index.css?inline";

const pluginExport = {
  name: "ButtonCustom",
  version: "1.0.0",
  Component,
  styles: styleText,
};

(window as any)["Plugin_button_custom"] = pluginExport;

// 👇 previne tree-shaking no modo iife
export const __keep = pluginExport;

// if (document.getElementById("root")) {
//   createRoot(document.getElementById("root")!).render(
//     <StrictMode>
//       <Component />
//     </StrictMode>,
//   );
// }
