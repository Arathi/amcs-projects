import { ModLoaderType } from "@amcs/curseforge-api";

export function parseModLoaderType(name?: string): ModLoaderType | undefined {
  if (name === undefined) return undefined;
  const lower = name.toLowerCase();
  switch (lower) {
    case "forge":
      return ModLoaderType.Forge;
    case "fabric":
      return ModLoaderType.Fabric;
    case "quilt":
      return ModLoaderType.Quilt;
    case "neoforge":
    case "neo-forge":
      return ModLoaderType.NeoForge;
  }
  console.warn("未知的模组加载器：", name);
  return undefined;
}

export function parseModLoaderTypeFromOptions({
  forge = false,
  fabric = false,
  quilt = false,
  neoForge = false,
}: Record<string, any>): ModLoaderType | undefined {
  if (forge) return ModLoaderType.Forge;
  if (fabric) return ModLoaderType.Fabric;
  if (quilt) return ModLoaderType.Quilt;
  if (neoForge) return ModLoaderType.NeoForge;
  return undefined;
}
