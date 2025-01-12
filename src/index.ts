import * as fs from "fs";
import * as path from "path";

const inputFolder = "./input";
const outputFolder = "./output";

const watchFolder = (inputFolder: string) => {
  fs.watch(inputFolder, (eventType, filename) => {
    if (eventType === "rename" && filename) {
      const file = path.join(inputFolder, filename);
      console.log(`File ${file} has been added`);
    }
  });
};

watchFolder(inputFolder);
