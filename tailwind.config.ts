import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "bg-blue-500", "bg-red-500", "bg-orange-500", "bg-sky-400", "bg-green-500",
    "text-blue-400", "text-red-400", "text-orange-400", "text-sky-400", "text-green-400",
    "border-blue-500", "border-red-500", "border-orange-500", "border-sky-400", "border-green-500",
  ],
};
export default config;
