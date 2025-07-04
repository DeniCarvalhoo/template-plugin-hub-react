import pkg from "../../../package.json";
import Component from "./component";
import { meta } from "./meta";
import styles from "./style.css?inline"; // Gerado automaticamente no build

(window as any)[`Plugin_${pkg.name}_${meta.id}`] = {
  ...meta,
  Component,
  styles,
};
