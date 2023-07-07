import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
const resources = {
  en: {
    translation: {
      "revoluciona": "🌿💡 Medicinal Cannabis and Smart Agriculture Token Pre-Sale! Join our financial and sustainable revolution. Invest now and be part of the change towards a healthy and promising future. 🚀🌱",
    "Billetera": "Connect Wallet",
    "presale-title": "WNB Pre-Sale",
    "Escoger Token": "Choose Token",
    "Comprar Ahora": "Buy Now",
    "progress-date": "Progress and Date",
    "sale-ends-in": "Sale ends in:",
    "timer": "07 days , 19 hours y 16 mins",
    "sold": "Sold:",
    "remaining": "Remaining:",
    "target": "Target:",
    "visit-website": "Visit Website",
    "Referral System": "Referral System",
    "share-link": "Share your referral link and instantly earn 5% in your wallet for each referred token purchase. The referral cash will be paid in the same token used for payment, USDT, USDC, or WBNB.",
    "copy-link": "Copy link",
    "informacion": "Token Info",
    "current-balance": "Current Balance:",
    "tokensventa":"Tokens for Sale:",
    "precio": "Price:",
    "comprarahora": "Buy Now",
    "balance": " Balance:",
    "select-payment": "Select payment method:",
    "enter-amount": "Enter Amount in",
    "total-raix": "Total WCBD to receive:",
    "buy wnb": "BUY WBNB",
    "transaction-notice": "* Please press the button twice, the first time is to approve the transaction and the second time to complete the purchase."
    },
  },
  sp: {
    translation: {
      "revoluciona": "🌿💡 ¡Preventa de Tokens de Cannabis Medicinal y Agricultura Inteligente! Únete a nuestra revolución financiera y sostenible. Invierte ahora y sé parte del cambio hacia un futuro saludable y prometedor. 🚀🌱.",
      "Billetera": "Conectar Billetera",
      "presale-title": "Venta Previa de Wenabis",
      "Escoger Token": "Escoger Token",
      "Comprar Ahora": "Comprar Ahora",
      "progress-date": "Progreso y Fecha",
      "sale-ends-in": "La venta termina en:",
      "timer": "07 días, 19 horas y 16 minutos",
      "sold": "Vendido:",
      "remaining": "Restantes:",
      "target": "Meta:",
      "visit-website": "Visitar sitio Web",
      "Referral System": "Sistema de Referidos",
      "share-link": "Comparte tu link y obten el 5% instantáneamente en tu billetera por cada compra referida de token. El efectivo del referido será pagado en el mismo token que haya sido usado para pagar, USDT, USDC o WBNB.",
      "copy-link": "Copiar link",
      "informacion": "Token Info",
      "precio": "precio:",
      "comprarahora": "Comprar Ahora",
      "current-balance": "Balance actual:",
      "balance": " Balance:",
      "select-payment": "Seleccionar medio de pago:",
      "enter-amount": "Ingresar Cantidad en",
      "total-raix": "Total WCBD a recibir:",
      "tokensventa":"Tokens en Venta:",
      "buy wnb": "Comprar WBNB",
      "transaction-notice": "* Por favor presione el botón dos veces, la primera vez es para aprobar la transacción y la segunda para realizar la compra."
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

const i18nfile = i18n;
export default i18nfile;
