import * as fs from "fs";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";

const inputFolder = "./input";
const outputFolder = "./output";

const watchFolder = (inputFolder: string) => {
  fs.watchFile(inputFolder, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      const files = fs.readdirSync(inputFolder);

      files.forEach((fileName) => {
        const file = path.join(".", inputFolder, fileName);

        handleNewFile(file);
      });
    }
  });
};

const handleNewFile = (filePath: string) => {
  const { name: fileName, ext: fileExt } = path.parse(filePath);

  const outputFilePath = path.join(".", outputFolder, fileName);

  if (!fs.existsSync(outputFilePath)) {
    fs.mkdirSync(outputFilePath);
  }

  const audioPath = path.join(outputFilePath, "audio.mp3");

  ffmpeg(filePath)
    .audioCodec("libmp3lame")
    .save(audioPath)
    .on("end", () => {
      console.log("Audio file created", audioPath);

      const videoOutputPath = path.join(outputFilePath, fileName + fileExt);
      fs.renameSync(filePath, videoOutputPath);

      console.log("Video file moved to output folder", videoOutputPath);
    })
    .on("error", (error) => {
      console.log("Error converting video to audio", error);
    });
};

watchFolder(inputFolder);
