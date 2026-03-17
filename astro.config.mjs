import { defineConfig } from 'astro/config'
import tailwind from "@astrojs/tailwind"
import icon from "astro-icon"
import robotsTxt from "astro-robots-txt"

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    icon({
      include: {
        "simple-icons": ["*"],
      },
    }),
    robotsTxt(),
  ],
  site: 'https://porfolio.dev/'
})
