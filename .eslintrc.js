module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["airbnb", "airbnb-typescript"],
    parserOptions: {
        project: ["./tsconfig.json"]
    },
    ignorePatterns: ["src/beefyPools/*"]
};