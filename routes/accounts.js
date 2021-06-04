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

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;
    const data = await getAccounts();
    account = { id: data.nextId++, ...account };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try{
    const data = await getAccounts();
    res.send(data.accounts);
  }catch (err){
    next(err);
  }
});

router.get("/:id", async (req, res, next)=> {
  try{
    const data = await getAccounts();
    const account = data.accounts.find(account => account.id === parseInt(req.params.id));
    res.send(account);
  }catch (err){
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
  const data = await getAccounts();
  data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));
  await writeFile(global.fileName, JSON.stringify(data, null, 2));
  res.send("Account deleted");
  }catch (err){
    next(err);
  }
});

router.put("/", async (req, res, next)=>{
  try{
    const data = await getAccounts();
    const account = req.body;
    const index = data.accounts.findIndex(a => a.id === account.id);
    data.accounts[index] = account;
    await writeFile(global.fileName, JSON.stringify(data));
    res.send(account);
  }catch (err){
    next(err);
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try{
    const data = await getAccounts();
    const account = req.body;
    const index = data.accounts.findIndex(a => a.id === account.id);
    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data));
    res.send(data.accounts[index]);
  }catch (err){
    next(err);
  }
});

router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({error: err.message});
});

export default router;
