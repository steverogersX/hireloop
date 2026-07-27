export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      ["frontend", "backend", "db", "ci", "deps", "repo"],
    ],
    "header-max-length": [2, "always", 100],
    "body-max-line-length": [2, "always", 100],
  },
};
