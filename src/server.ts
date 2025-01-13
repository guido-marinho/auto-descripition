import { app } from "./app";
import InputFile from "./models/InputFile";

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await InputFile.sync();
    console.log("Tabela InputFile sincronizada com sucesso.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Erro ao sincronizar a tabela InputFile:", error);
  }
};

startServer();
