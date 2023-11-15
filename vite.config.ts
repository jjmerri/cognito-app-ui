import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {}, // this is needed to fix an issue stemming from amazon-cognito-identity-js https://stackoverflow.com/questions/61555262/aws-amplify-js-to-angular-app-has-error-global-is-not-defined
  },
});
