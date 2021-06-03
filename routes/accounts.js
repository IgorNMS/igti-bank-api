import express, { json } from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

async function getAccounts(){
  return JSON.parse(await readFile(global.fileName));
}

async function defaultErrorMessage(res, err){
  res.status(500).send({error: err});
}

router.post("/", async (req, res) => {
  try {
    let account = req.body;
    const data = await getAccounts();
    account = { id: data.nextId++, ...account };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
  } catch (err) {
    await defaultErrorMessage(res, err.message);
  }
});

router.get("/", async (req, res) => {
  try{
    const data = await getAccounts();
    res.send(data.accounts);
  }catch (err){
    await defaultErrorMessage(res, err.message);
  }
});

router.get("/:id", async (req, res)=> {
  try{
    const data = await getAccounts();
    const account = data.accounts.find(account => account.id === parseInt(req.params.id));
    res.send(account);
  }catch (err){
    await defaultErrorMessage(res, err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
  const data = await getAccounts();
  data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  res.send("Account deleted");
  }catch (err){
    await defaultErrorMessage(res, err.message);;
  }
});

export default router;
