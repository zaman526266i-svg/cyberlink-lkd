import path from "path";
import { promises as fs } from "fs";
import { CONTENT_FILES, getContentFileByKey } from "@/lib/contentFiles";
import clientPromise from "@/lib/mongodb";

const CONTENT_COLLECTION = "site_content";

function getAbsolutePath(relativePath) {
  return path.join(process.cwd(), relativePath);
}

async function getContentCollection() {
  const client = await clientPromise;
  return client.db("cluster0").collection(CONTENT_COLLECTION);
}

export async function readContentByKey(key) {
  const file = getContentFileByKey(key);
  if (!file) return null;

  try {
    const collection = await getContentCollection();
    const stored = await collection.findOne({ key: file.key });
    if (stored?.content) {
      return {
        key: file.key,
        label: file.label,
        path: file.relativePath,
        content: stored.content,
        source: "database",
      };
    }
  } catch {
    // Fall back to bundled JSON when database content is unavailable.
  }

  const fullPath = getAbsolutePath(file.relativePath);
  const raw = await fs.readFile(fullPath, "utf8");
  const content = JSON.parse(raw);
  return {
    key: file.key,
    label: file.label,
    path: file.relativePath,
    content,
    source: "file",
  };
}

export async function writeContentByKey(key, parsedContent) {
  const file = getContentFileByKey(key);
  if (!file) return false;

  const collection = await getContentCollection();
  await collection.updateOne(
    { key: file.key },
    {
      $set: {
        key: file.key,
        label: file.label,
        path: file.relativePath,
        content: parsedContent,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  if (process.env.NODE_ENV !== "production") {
    const fullPath = getAbsolutePath(file.relativePath);
    await fs.writeFile(fullPath, `${JSON.stringify(parsedContent, null, 2)}\n`, "utf8");
  }

  return true;
}

export function getContentFileList() {
  return CONTENT_FILES.map(({ key, label, relativePath }) => ({
    key,
    label,
    path: relativePath,
  }));
}
