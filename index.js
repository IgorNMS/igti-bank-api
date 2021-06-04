global.fileName = "accounts.json";
import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

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
  console.log("Started on port: " +port);
});
