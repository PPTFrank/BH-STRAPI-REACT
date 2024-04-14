import logo from "./extensions/FrankStore.jpg";

const config = {
  locales: ["vi", "en"],
  // Replace the Strapi logo in auth (login) views
  auth: {
    logo,
  },
  // Replace the favicon
  head: {
    favicon: logo,
  },
  // Replace the Strapi logo in the main navigation
  menu: {
    logo,
  },
  // Extend the translations
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "Frank Store",

      "app.components.LeftMenu.navbrand.workplace": "Frank Store CMS",

      "Auth.form.welcome.title": "Frank Store CMS",
    },
    vi: {
      "Auth.form.welcome.title": "Frank Store CMS",
    },
  },
  // Disable video tutorials
  tutorials: false,
  // Disable notifications about new Strapi releases
  notifications: { releases: false },
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
