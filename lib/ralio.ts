import { RalioClient } from "@ralioco/sdk";
import fs from "fs";

let client: RalioClient | null = null;

export async function getRalioClient(): Promise<RalioClient> {
  if (client) return client;

  const keyPath = "/tmp/ralio-key.pem";
  const privateKey = process.env.RALIO_PRIVATE_KEY;
  if (!privateKey) throw new Error("RALIO_PRIVATE_KEY env var is not set");
  if (!process.env.RALIO_CLIENT_ID) throw new Error("RALIO_CLIENT_ID env var is not set");

  fs.writeFileSync(keyPath, privateKey.replace(/\\n/g, "\n"), { mode: 0o600 });

  client = await RalioClient.create({
    clientId: process.env.RALIO_CLIENT_ID,
    privateKeyPath: keyPath,
    timeoutMs: 120000,
  });

  return client;
}
