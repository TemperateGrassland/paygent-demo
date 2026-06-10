import fs from "fs";
import path from "path";
import type { Job } from "./types";

const DB_PATH = path.join(process.cwd(), "data", "jobs.json");

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function load(): Map<string, Job> {
  ensureDir();
  if (!fs.existsSync(DB_PATH)) return new Map();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return new Map(JSON.parse(raw));
}

function save(map: Map<string, Job>) {
  ensureDir();
  fs.writeFileSync(DB_PATH, JSON.stringify(Array.from(map.entries()), null, 2));
}

export const jobs = new Proxy(new Map<string, Job>(), {
  get(_, prop) {
    const map = load();
    const method = prop as keyof Map<string, Job>;

    if (method === "set") {
      return (key: string, value: Job) => {
        map.set(key, value);
        save(map);
        return map;
      };
    }
    if (method === "delete") {
      return (key: string) => {
        const result = map.delete(key);
        save(map);
        return result;
      };
    }
    if (method === "get" || method === "has" || method === "values" || method === "keys" || method === "entries" || method === "size" || method === Symbol.iterator) {
      const val = (map as any)[method as any];
      return typeof val === "function" ? val.bind(map) : val;
    }
    const val = (map as any)[prop as any];
    return typeof val === "function" ? val.bind(map) : val;
  },
});
