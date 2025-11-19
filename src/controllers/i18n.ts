import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";
import { Lang } from "../types/types";

export async function initI18n(lang: Lang) {
  await i18next.use(Backend).init(
    {
      fallbackLng: lang,
      supportedLngs: ["en", "es"],
      ns: ["prompts", "properties", "suggestions"],
      defaultNS: "prompts",
      backend: {
        loadPath: path.join(__dirname, "./../locales/{{lng}}/{{ns}}.json"),
      },
      interpolation: {
        escapeValue: false,
      },
      returnObjects: true
    }
  );
}

export function tPrompts(key: string, lng: string, options?: any) {
  return i18next.t(`prompts:${key}`, { lng, ...options });
}

export function tProperties(key: string, lng: string, options?: any) {
  return i18next.t(`properties:${key}`, { lng, ...options });
}

export function tSuggestions(key: string, lng: string, options?: any) {
  return i18next.t(`suggestions:${key}`, { lng, ...options });
}
