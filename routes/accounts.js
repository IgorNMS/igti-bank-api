import express, { json } from "express";
import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

const router = express.Router();

async function getAccounts(){
  return JSON.parse(await readFile(global.fileName));
}

router.post("/", async (req, res, next) => {
  try {
    let account = req.body;
    if (!account.name || account.balance === null){
      throw new Error("Name e Balance são obrigatorios!")
    }
    const data = await getAccounts();
    account = {
      id: data.nextId++,
      name: account.name,
      balance: account.balance
    };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info("POST /account" + JSON.stringify(account));
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try{
    const data = await getAccounts();
    res.send(data.accounts);
    logger.info("GET /account");
  }catch (err){
    next(err);
  }
});

router.get("/:id", async (req, res, next)=> {
  try{
    const data = await getAccounts();
    const account = data.accounts.find(account => account.id === parseInt(req.params.id));
    res.send(account);
    logger.info("GET /account/:id");
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
    logger.info("DELETE /account/:id " + req.params.id);
  }catch (err){
    next(err);
  }
});

router.put("/", async (req, res, next)=>{
  try{
    const data = await getAccounts();
    const account = req.body;
    if (!account.id ||!account.name || account.balance === null){
      throw new Error("Id, Name e Balance são obrigatorios!")
    }
    const index = data.accounts.findIndex(a => a.id === account.id);
    if(index === -1){
      throw new Error("Registro não enconntrado!");
    }
    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(account);
    logger.info("PUT /account" + JSON.stringify(account));
  }catch (err){
    next(err);
  }
});

router.patch("/updateBalance", async (req, res, next) => {
  try{
    const data = await getAccounts();
    const account = req.body;
    const index = data.accounts.findIndex(a => a.id === account.id);
    if (!account.id || account.balance === null){
      throw new Error("Id e Balance são obrigatorios!")
    }
    if(index === -1){
      throw new Error("Registro não enconntrado!");
    }
    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    res.send(data.accounts[index]);
    logger.info("PATCH /account/updateBalance" + JSON.stringify(account));
  }catch (err){
    next(err);
  }
});

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  console.log(err);
  res.status(500).send({error: err.message});
});

export default router;
