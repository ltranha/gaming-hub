/**
 * Lightweight i18n (internationalization) system.
 *
 * Supports EN and FR. Translations are keyed by dot-notation strings.
 * Use the `t()` helper to look up translations. Falls back to the key
 * itself if no translation is found.
 *
 * @module lib/i18n
 */

export type Locale = "en" | "fr";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.games": "Games",
    "nav.admin": "Admin",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",
    "nav.signInUp": "Sign In / Sign Up",
    "nav.guest": "Continue as Guest",
    "nav.or": "or",
    "nav.email": "Email",
    "nav.password": "Password",

    "hub.title": "Games Hub",
    "hub.subtitle": "Play classic and multiplayer games right in your browser.",
    "hub.search": "Search games...",
    "hub.all": "All",
    "hub.noResults": "No games found.",

    "game.howToPlay": "How to Play / Rules",
    "game.funFacts": "Fun Facts",
    "game.learnMore": "Learn more on Wikipedia →",
    "game.restart": "Restart",
    "game.back": "Back",

    "game.mode.local": "Local",
    "game.mode.ai": "vs AI",
    "game.mode.online": "Online",
    "game.mode.localDesc": "Play on the same device",
    "game.mode.aiDesc": "Challenge the computer",
    "game.mode.onlineDesc": "Play with friends online",

    "game.difficulty.easy": "Easy",
    "game.difficulty.medium": "Medium",
    "game.difficulty.hard": "Hard",

    "game.score": "Score",
    "game.best": "Best",
    "game.moves": "Moves",
    "game.time": "Time",
    "game.mines": "Mines",
    "game.mistakes": "Mistakes",

    "admin.title": "Admin Dashboard",
    "admin.signIn": "Sign In",
    "admin.password": "Admin password",
    "admin.totalGames": "Total Games",
    "admin.active": "Active",
    "admin.public": "Public",
    "admin.categories": "Categories",
  },

  fr: {
    "nav.games": "Jeux",
    "nav.admin": "Admin",
    "nav.signIn": "Connexion",
    "nav.signOut": "Déconnexion",
    "nav.signInUp": "Connexion / Inscription",
    "nav.guest": "Continuer en invité",
    "nav.or": "ou",
    "nav.email": "Email",
    "nav.password": "Mot de passe",

    "hub.title": "Hub de Jeux",
    "hub.subtitle": "Jouez à des jeux classiques et multijoueurs directement dans votre navigateur.",
    "hub.search": "Rechercher des jeux...",
    "hub.all": "Tous",
    "hub.noResults": "Aucun jeu trouvé.",

    "game.howToPlay": "Comment Jouer / Règles",
    "game.funFacts": "Le Saviez-Vous ?",
    "game.learnMore": "En savoir plus sur Wikipédia →",
    "game.restart": "Recommencer",
    "game.back": "Retour",

    "game.mode.local": "Local",
    "game.mode.ai": "contre l'IA",
    "game.mode.online": "En ligne",
    "game.mode.localDesc": "Jouer sur le même appareil",
    "game.mode.aiDesc": "Défier l'ordinateur",
    "game.mode.onlineDesc": "Jouer avec des amis en ligne",

    "game.difficulty.easy": "Facile",
    "game.difficulty.medium": "Moyen",
    "game.difficulty.hard": "Difficile",

    "game.score": "Score",
    "game.best": "Meilleur",
    "game.moves": "Coups",
    "game.time": "Temps",
    "game.mines": "Mines",
    "game.mistakes": "Erreurs",

    "admin.title": "Tableau de Bord Admin",
    "admin.signIn": "Connexion",
    "admin.password": "Mot de passe admin",
    "admin.totalGames": "Total Jeux",
    "admin.active": "Actifs",
    "admin.public": "Publics",
    "admin.categories": "Catégories",
  },
};

/** Get a translated string for the given key and locale. Falls back to key. */
export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

/** Get all available locales. */
export function getLocales(): { id: Locale; label: string; flag: string }[] {
  return [
    { id: "en", label: "English", flag: "🇺🇸" },
    { id: "fr", label: "Français", flag: "🇫🇷" },
  ];
}
