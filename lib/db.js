export function getDbName() {
  return process.env.MONGODB_DB || "cluster0";
}

