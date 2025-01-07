import { i18n } from "@lingui/core";
import { messages as enMessages } from "../public/locales/en/messages.mjs";
import { messages as esMessages } from "../public/locales/es/messages.mjs";
import { messages as frMessages } from "../public/locales/fr/messages.mjs";
import { messages as jpMessages } from "../public/locales/jp/messages.mjs";
import { messages as cnMessages } from "../public/locales/cn/messages.mjs";
import { messages as ptMessages } from "../public/locales/pt/messages.mjs";
import { messages as ruMessages } from "../public/locales/ru/messages.mjs";
import { messages as koMessages } from "../public/locales/ko/messages.mjs";

let isInitialized = false;

function initializeI18n(locale: string) {
	if (!isInitialized) {
		i18n.load({
			en: enMessages,
			es: esMessages,
			fr: frMessages,
			jp: jpMessages,
			cn: cnMessages,
			pt: ptMessages,
			ru: ruMessages,
			ko: koMessages,
		});
		i18n.activate(locale);
		isInitialized = true;
	}
}

export function getI18n(locale: string) {
	initializeI18n(locale);
	return i18n;
}
