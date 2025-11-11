import helmet from "helmet";
import { DEBUG, ALLOWED_ORIGINS } from "./env.js";

export const buildHelmetConfig = () => {
  const helmetOptions = {};

  if (DEBUG) {
    console.log("🧩 Helmet con CSP relajado (modo desarrollo)");

    const baseSrc = ["'self'", ...ALLOWED_ORIGINS];
    const inlineSrc = [...baseSrc, "'unsafe-inline'", "data:", "blob:"];

    helmetOptions.contentSecurityPolicy = {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: baseSrc,
        imgSrc: inlineSrc,
        scriptSrc: inlineSrc,
        styleSrc: inlineSrc,
        fontSrc: inlineSrc,
      },
    };
    helmetOptions.crossOriginEmbedderPolicy = false;
    helmetOptions.crossOriginOpenerPolicy = false;

  } else {
    console.log("🧱 Helmet con configuración segura (producción)");

    const allowedFrontend = ["'self'", ...ALLOWED_ORIGINS];

    helmetOptions.contentSecurityPolicy = {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: allowedFrontend,
        imgSrc: [...allowedFrontend, "data:"],
        scriptSrc: allowedFrontend,
        styleSrc: allowedFrontend,
        fontSrc: allowedFrontend,
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    };

    helmetOptions.crossOriginEmbedderPolicy = true;
    helmetOptions.crossOriginOpenerPolicy = true;
    helmetOptions.crossOriginResourcePolicy = { policy: "same-origin" };
    helmetOptions.hsts = {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    };
  }

  return helmet(helmetOptions);
};
