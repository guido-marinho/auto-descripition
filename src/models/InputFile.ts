import { DataTypes, Model, Optional, Sequelize } from "sequelize";

type InputFileAttributes = {
  id: number;
  name: string;
  inputPath: string;
  outputPath: string;
  transcription: string;
};

type InputFileCreationAttributes = Optional<InputFileAttributes, "id">;

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

class InputFile extends Model<
  InputFileAttributes,
  InputFileCreationAttributes
> {
  declare id: number;
  declare name: string;
  declare inputPath: string;
  declare outputPath: string;
  declare transcription: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

InputFile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inputPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    outputPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transcription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "InputFile",
  }
);

export default InputFile;
