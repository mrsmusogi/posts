module.exports = async () => {
  const excluded = new Set([".obsidian", "_templates", "_scripts"]);
  const root = app.vault.getRoot();

  return root.children
    .filter((entry) => entry && entry.children && !excluded.has(entry.name))
    .filter((entry) => !entry.name.startsWith(".") && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
};
