import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.{js,ts,jsx,tsx}"], // apply to all relevant files
    rules: {
      "@typescript-eslint/no-unused-vars": "off",

      // Optional: also turn off regular JS rule for completeness
      "no-unused-vars": "off",

      // Allow `any`
      "@typescript-eslint/no-explicit-any": "off",

      // Optional useEffect deps
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
