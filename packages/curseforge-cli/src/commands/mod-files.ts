import { Command } from "commander";
import client from "../utils/curseforge";
import { ModLoaderType, ReleaseType } from "@amcs/curseforge-api";
import { table } from "table";
import { parseModLoaderType, parseModLoaderTypeFromOptions } from "./parsers";
import { formatDate, toFileSize, toHumanReadable } from "./formatters";

interface Options {
  gameVersion?: string;
  modLoader?: string;
  forge?: boolean;
  fabric?: boolean;
  quilt?: boolean;
  neoForge?: boolean;
}

const command = new Command("mod-files")
  .description("获取模组文件")
  .argument("<modKey>", "模组ID / slug")
  .option("-g, --game-version <version>")
  .option("-l, --mod-loader <loader>")
  .option("--forge")
  .option("--fabric")
  .option("--quilt")
  .option("--neo-forge")
  .action(modFiles);

async function modFiles(modKey: string, options: Options) {
  const { gameVersion, modLoader } = options;

  let modLoaderType: ModLoaderType | undefined = undefined;
  if (modLoader !== undefined) {
    modLoaderType = parseModLoaderType(modLoader);
  } else {
    modLoaderType = parseModLoaderTypeFromOptions(options);
  }

  let modId = parseInt(modKey);
  if (isNaN(modId)) {
    const mod = await getModBySlug(modKey);
    modId = mod.id;
  }

  const resp = await client.getModFiles(modId, {
    gameVersion,
    modLoaderType,
  });

  const files = resp.data;

  const records: any[][] = [
    ["#", "类型", "ID", "文件名", "文件大小", "更新时间", "下载次数"],
  ];

  files.forEach((file, index) => {
    const { id, fileName, fileLength, fileDate, downloadCount } = file;

    let type = "E";
    switch (file.releaseType) {
      case ReleaseType.Alpha:
        type = "A";
        break;
      case ReleaseType.Beta:
        type = "B";
        break;
      case ReleaseType.Release:
        type = "R";
        break;
    }

    const fileSize = toFileSize(fileLength, 1);
    const updatedAt = formatDate(fileDate);
    const downloads = toHumanReadable(downloadCount, 1);

    const record = [
      index + 1,
      type,
      id,
      fileName,
      fileSize,
      updatedAt,
      downloads,
    ];
    records.push(record);
  });

  console.info(
    table(records, {
      columns: [
        { alignment: "right" },
        { alignment: "center" },
        { alignment: "right" },
        {},
        { alignment: "right" },
        {},
        { alignment: "right" },
      ],
    })
  );
}

async function getModBySlug(slug: string) {
  const resp = await client.searchMods({ slug });
  const mods = resp.data;
  return mods[0];
}

export default command;
