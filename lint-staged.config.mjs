const frontend = () => [
  "npm --prefix frontend run lint",
  "npm --prefix frontend run typecheck",
];

const backend = () => [
  "npm --prefix backend run lint",
  "npm --prefix backend run typecheck",
];

export default {
  "frontend/**/*.{ts,tsx,js,jsx,mjs}": frontend,
  "backend/**/*.ts": backend,
};
