import { DefaultCurseForgeClient } from "@amcs/curseforge-api";

const apiKey = process.env.CURSE_FORGE_API_KEY ?? "";
const client = new DefaultCurseForgeClient(apiKey);

export default client;
