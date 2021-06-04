import express from "express";
import winston from "winston";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;
const {combine, timestamp, label, printf } = winston.format;

const newFormat = printf(({level, message, label, timestamp }) =>{
  return `${timestamp} [${timestamp}] ${level}: ${message}`;
});

global.fileName = "accounts.json";
global.logger = winston.createLogger({
  level:"silly",
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({filename: "bank-api.log"})
  ],
  format: combine(
      label({label: "igti-bank-api"}),
      timestamp(),
      newFormat
  )
});

const app = express();
app.use(express.json());

app.use("/accounts", accountsRouter);

const port = 3030;

app.listen(port, async () => {
  try {
    await readFile(global.fileName);
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    await writeFile(global.fileName, JSON.stringify(initialJson));
  }
  logger.info("Started on port: " +port);
});