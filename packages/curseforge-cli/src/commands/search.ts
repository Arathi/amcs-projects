import { Command } from "commander";
import client from "../utils/curseforge";
import { ModLoaderType } from "@amcs/curseforge-api";
import { table } from "table";
import { parseModLoaderType, parseModLoaderTypeFromOptions } from "./parsers";
import { formatDate, toHumanReadable } from "./formatters";

interface Options {
  gameVersion?: string;
  modLoader?: string;
  forge?: boolean;
  fabric?: boolean;
  quilt?: boolean;
  neoForge?: boolean;
  slug?: boolean;
}

const command = new Command("search")
  .description("搜索模组")
  .argument("[keyword]", "关键字")
  .option("-g, --game-version <version>")
  .option("-l, --mod-loader <loader>")
  .option("--forge")
  .option("--fabric")
  .option("--quilt")
  .option("--neo-forge")
  .option("-s, --slug")
  .action(search);

async function search(keyword: string | undefined, options: Options) {
  const { gameVersion, modLoader, slug: useSlug = false } = options;

  let slug: string | undefined = undefined;
  let searchFilter: string | undefined = undefined;
  let modLoaderType: ModLoaderType | undefined = undefined;

  if (useSlug) {
    slug = keyword;
  } else {
    searchFilter = keyword;
  }

  if (modLoader !== undefined) {
    modLoaderType = parseModLoaderType(modLoader);
  } else {
    modLoaderType = parseModLoaderTypeFromOptions(options);
  }

  const resp = await client.searchMods({
    gameVersion,
    modLoaderType,
    searchFilter,
    slug,
  });

  const mods = resp.data;

  const records: any[][] = [
    ["#", "ID", "作者", "名称", "更新时间", "下载次数"],
  ];
  mods.forEach((mod, index) => {
    const { id, name, downloadCount, dateModified } = mod;
    const author = mod.authors[0].name;
    const updatedAt = formatDate(dateModified);
    const downloads = toHumanReadable(downloadCount, 1);
    const record = [index + 1, id, author, name, updatedAt, downloads];
    records.push(record);
  });

  console.info(
    table(records, {
      columns: [
        { alignment: "right" },
        { alignment: "right" },
        { alignment: "center" },
        { alignment: "center" },
        {},
        { alignment: "right" },
      ],
    })
  );
}

export default command;
