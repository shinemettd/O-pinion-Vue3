import vuetify from './vuetify'
import router from "@/plugins/router";

export function registerPlugins (app) {
  app.use(vuetify)
  app.use(router)
}
