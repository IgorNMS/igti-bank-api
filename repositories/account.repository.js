import { promises as fs } from "fs";

const { readFile, writeFile } = fs;

async function getAccountsFromFile(){
    return JSON.parse(await readFile(global.fileName));
}

async function getAccounts(){
    const data = JSON.parse(await readFile(global.fileName));
    return data.accounts;
}

async function getAccountsById(id){
    const data = await getAccountsFromFile();
    const account = data.accounts.find(account => account.id === parseInt(id));
    if(account){
        return account;
    }else {
        throw new Error("Registro não encontrado.");
    }
}

async function insertAccount(account){
    const data = await getAccountsFromFile();
    account = {
        id: data.nextId++,
        name: account.name,
        balance: account.balance
    };
    data.accounts.push(account);
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    return account;
}

async function deleteAccount(id){
    const data = await getAccountsFromFile();
    data.accounts = data.accounts.filter(account => account.id !== parseInt(id));
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
}

async function updateAccount(account){
    const data = await getAccountsFromFile();
    const index = data.accounts.findIndex(a => a.id === account.id);
    if(index === -1){
        throw new Error("Registro não encontrado!");
    }
    data.accounts[index].name = account.name;
    data.accounts[index].balance = account.balance;
    await writeFile(global.fileName, JSON.stringify(data, null, 2));
    return data.accounts[index];
}

export default {
    getAccounts,
    getAccountsById,
    insertAccount,
    deleteAccount,
    updateAccount
}