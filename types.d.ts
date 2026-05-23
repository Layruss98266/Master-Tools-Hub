import "react";

// Allow CSS custom properties (e.g. style={{ "--delay": "60ms" }}) in style props.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
