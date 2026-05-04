import { CONTENT_FILES, collectionNameForContentKey, getContentFileByKey } from "@/lib/contentFiles";
import contentDefaults from "@/lib/seed/contentDefaults.json";
import clientPromise from "@/lib/mongodb";

const LEGACY_CONTENT_COLLECTION = "site_content";

function getDbName() {
  return process.env.MONGODB_DB || "cluster0";
}

function cloneDefaultContent(key) {
  const raw = contentDefaults[key];
  if (!raw) return {};
  return JSON.parse(JSON.stringify(raw));
}

async function getDatabase() {
  const client = await clientPromise;
  return client.db(getDbName());
}

async function getLegacyContentCollection() {
  const db = await getDatabase();
  return db.collection(LEGACY_CONTENT_COLLECTION);
}

async function getContentCollection(key) {
  const db = await getDatabase();
  return db.collection(collectionNameForContentKey(key));
}

/**
 * Dedicated collection → legacy site_content → bundled defaults (persisted to DB).
 */
async function loadOrMigrateContentDocument(key) {
  const file = getContentFileByKey(key);
  if (!file) return null;

  const coll = await getContentCollection(key);
  const existing = await coll.findOne({ _id: "main" });
  if (existing?.content) return existing;

  const legacyColl = await getLegacyContentCollection();
  const legacy = await legacyColl.findOne({ key: file.key });
  if (legacy?.content) {
    await coll.updateOne(
      { _id: "main" },
      {
        $set: {
          key: file.key,
          label: file.label,
          content: legacy.content,
          updatedAt: legacy.updatedAt || new Date(),
        },
      },
      { upsert: true }
    );
    return coll.findOne({ _id: "main" });
  }

  const content = cloneDefaultContent(key);
  await coll.updateOne(
    { _id: "main" },
    {
      $set: {
        key: file.key,
        label: file.label,
        content,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  return coll.findOne({ _id: "main" });
}

export async function readContentByKey(key) {
  const file = getContentFileByKey(key);
  if (!file) return null;

  const collection = collectionNameForContentKey(file.key);

  try {
    const doc = await loadOrMigrateContentDocument(key);
    if (doc?.content) {
      return {
        key: file.key,
        label: file.label,
        collection,
        content: doc.content,
        source: "database",
      };
    }
  } catch {
    // Mongo unavailable: still serve bundled defaults for the site.
  }

  return {
    key: file.key,
    label: file.label,
    collection,
    content: cloneDefaultContent(key),
    source: "defaults",
  };
}

export async function writeContentByKey(key, parsedContent) {
  const file = getContentFileByKey(key);
  if (!file) return false;

  const coll = await getContentCollection(file.key);
  await coll.updateOne(
    { _id: "main" },
    {
      $set: {
        key: file.key,
        label: file.label,
        content: parsedContent,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  const legacyColl = await getLegacyContentCollection();
  await legacyColl.deleteOne({ key: file.key });

  return true;
}

export function getContentFileList() {
  return CONTENT_FILES.map(({ key, label }) => ({
    key,
    label,
    collection: collectionNameForContentKey(key),
  }));
}
