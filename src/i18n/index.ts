import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './locales/en.json'
import vi from './locales/vi.json'

i18n.use(initReactI18next).init({
    lng: localStorage.getItem("locales") as string,
    resources: {
        en,
        vi
    },
    fallbackLng: "en",
    defaultNS: "translation",
})