export {};

declare global {
  interface Window {
    VLibras?: {
      Widget: new (rootPath: string) => void;
    };
    onload?: () => void;
  }
}

declare module "react" {
  interface HTMLAttributes<T> {
    vw?: string;
    "vw-access-button"?: string;
    "vw-plugin-wrapper"?: string;
  }
}
