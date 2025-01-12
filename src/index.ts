import * as fs from "fs";
import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import { transcribeAudio } from "./services/genai";

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

const handleNewFile = async (filePath: string) => {
  const { name: fileName, ext: fileExt } = path.parse(filePath);

  const outputFilePath = path.join(".", outputFolder, fileName);

  if (!fs.existsSync(outputFilePath)) {
    fs.mkdirSync(outputFilePath);
  }

  const audioPath = path.join(outputFilePath, "audio.mp3");

  try {
    await convertVideoToAudio(filePath, audioPath);
    console.log("Audio file created", audioPath);

    const videoOutputPath = path.join(outputFilePath, fileName + fileExt);

    if (fs.existsSync(filePath)) {
      fs.renameSync(filePath, videoOutputPath);
      console.log("Video file moved", videoOutputPath);
    } else {
      console.log("Video file not found", filePath);
    }
  } catch (error) {
    console.error("Error converting video to audio", error);
  }

  try {
    const transcriptionFilePath = path.join(
      outputFilePath,
      "transcription.txt"
    );

    console.log("Transcribing audio", audioPath);
    const transcription = await transcribeAudio(audioPath);
    fs.writeFileSync(transcriptionFilePath, transcription);
    console.log("TranscriptionText", transcription);
  } catch (error) {
    console.error("Error transcribing audio", error);
  }
};

const convertVideoToAudio = (
  inputPath: string,
  outputPath: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioCodec("libmp3lame")
      .save(outputPath)
      .on("end", () => {
        console.log("Audio file created", outputPath);
        resolve();
      })
      .on("error", (error) => {
        console.log("Error converting video to audio", error);
        reject();
      });
  });
};

watchFolder(inputFolder);
