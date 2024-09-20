import { Command } from "commander";
import { version } from "../package.json";
import search from "./commands/search";
import modFiles from "./commands/mod-files";

const program = new Command("curseforge")
  .description("CurseForge command line interface.")
  .version(version);

program.addCommand(search);
program.addCommand(modFiles);
// command.addCommand(getMod);
// command.addCommand(getModFile);
// command.addCommand(getModFiles);
// command.addCommand(getModFileDownloadURL);

program.parse(process.argv);
