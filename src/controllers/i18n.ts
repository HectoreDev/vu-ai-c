import i18next from "i18next";


import enPrompts from "../locales/en/prompts.json";
import enProperties from "../locales/en/properties.json";
import enSuggestions from "../locales/en/suggestions.json";

import esPrompts from "../locales/es/prompts.json";
import esProperties from "../locales/es/properties.json";
import esSuggestions from "../locales/es/suggestions.json";
import { Lang } from "../types/types";

const resources = {
  en: {
    prompts: enPrompts,
    properties: enProperties,
    suggestions: enSuggestions,
  },
  es: {
    prompts: esPrompts,
    properties: esProperties,
    suggestions: esSuggestions,
  },
};

let initialized = false;

export async function initI18n(lang: Lang) {
  if (!initialized) {
    await i18next.init({
      lng: lang,
      fallbackLng: "en",
      supportedLngs: ["en", "es"],
      ns: ["prompts", "properties", "suggestions"],
      defaultNS: "prompts",
      resources,
      interpolation: {
        escapeValue: false,
      },
      returnObjects: true,
    });

    initialized = true;
  } else {
    // si ya está inicializado, sólo cambiamos de idioma
    i18next.changeLanguage(lang);
  }
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
