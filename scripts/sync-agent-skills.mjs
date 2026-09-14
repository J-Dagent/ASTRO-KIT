import { lstat, mkdir, readdir, readlink, rm, symlink } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const canonicalDir = path.join(root, ".agents", "skills");
const claudeDir = path.join(root, ".claude", "skills");

await mkdir(claudeDir, { recursive: true });

const canonicalEntries = await readdir(canonicalDir, { withFileTypes: true });
const skills = canonicalEntries
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const expected = new Set(skills);

for (const entry of await readdir(claudeDir, { withFileTypes: true })) {
  const targetPath = path.join(claudeDir, entry.name);
  if (!entry.isSymbolicLink()) {
    throw new Error(`Refusing to overwrite unexpected physical entry: ${targetPath}`);
  }
  if (!expected.has(entry.name)) {
    await rm(targetPath);
  }
}

for (const skill of skills) {
  const linkPath = path.join(claudeDir, skill);
  const relativeTarget = path.join("..", "..", ".agents", "skills", skill);
  let currentTarget;
  try {
    const stats = await lstat(linkPath);
    if (!stats.isSymbolicLink()) {
      throw new Error(`Refusing to overwrite unexpected physical entry: ${linkPath}`);
    }
    currentTarget = await readlink(linkPath);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  if (currentTarget !== relativeTarget) {
    if (currentTarget !== undefined) await rm(linkPath);
    await symlink(relativeTarget, linkPath, "dir");
  }
}

console.log(`Synchronized ${skills.length} project skill symlinks.`);
