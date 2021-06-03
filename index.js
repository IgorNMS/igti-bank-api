import express from "express";
import accountsRouter from "./routes/accounts.js";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());

app.use("/accounts", accountsRouter);

app.listen(3030, async () => {
  try {
    await readFile("accounts.json");
  } catch (err) {
    const initialJson = {
      nextId: 1,
      accounts: [],
    };
    writeFile("accounts.json", JSON.stringify(initialJson));
  }
  console.log("Started!");
});
