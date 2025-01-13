import express from "express";
import InputFile from "./models/InputFile";

export const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  const { name, inputPath, outputPath, transcription } = req.body;

  await InputFile.create({
    name,
    inputPath,
    outputPath,
    transcription,
  })
    .then((inputFile) => {
      res.status(201).json(inputFile);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Erro ao criar um novo arquivo de entrada.");
    });
});

export default app;
