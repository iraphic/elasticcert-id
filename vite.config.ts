import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  resolve: {
    alias: {
      "#": "/src",
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    !isVercel && cloudflare(),
  ].filter(Boolean),
});
