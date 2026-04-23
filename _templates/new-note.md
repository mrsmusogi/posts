<%*
const toYamlString = (value) => {
return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
};

const categories = await tp.user.getCategories();
if (!categories.length) {
throw new Error("No top-level category folders found.");
}

let title = "";
while (!title) {
const input = await tp.system.prompt("Title");
if (input === null) {
throw new Error("Template cancelled: title is required.");
}
title = input.trim();
}

const category = await tp.system.suggester(categories, categories, false, "Select category");
if (!category) {
throw new Error("Template cancelled: category is required.");
}

const tagsInput = await tp.system.prompt("Tags (comma-separated, optional)");
const tags = (tagsInput || "")
.split(",")
.map((tag) => tag.trim())
.filter((tag) => tag.length > 0);

let slug = tp.user.slugify(title);
if (!slug) {
throw new Error("Template cancelled: unable to slugify title.");
}

let targetPath = `${category}/${slug}`;
while (app.vault.getAbstractFileByPath(`${targetPath}.md`)) {
const uniqueTitle = await tp.system.prompt(
`A note named ${slug}.md already exists in ${category}. Enter a unique title`
);

if (uniqueTitle === null) {
throw new Error("Template cancelled: unique title required.");
}

title = uniqueTitle.trim();
if (!title) {
continue;
}

slug = tp.user.slugify(title);
if (!slug) {
continue;
}

targetPath = `${category}/${slug}`;
}

const date = tp.date.now("YYYY-MM-DD");

let frontmatter = "---\n";
frontmatter += `category: ${toYamlString(category)}\n`;

if (tags.length) {
frontmatter += "tags:\n";
for (const tag of tags) {
frontmatter += `  - ${toYamlString(tag)}\n`;
}
} else {
frontmatter += "tags: []\n";
}

frontmatter += `title: ${toYamlString(title)}\n`;
frontmatter += `date: ${toYamlString(date)}\n`;
frontmatter += "published: false\n";
frontmatter += "---\n\n";

await tp.file.move(targetPath);

tR += frontmatter;

%>
