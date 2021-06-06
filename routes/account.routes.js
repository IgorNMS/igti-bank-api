import express from "express";
import accountController from "../controllers/account.controllers.js"
import cors from "cors";

const router = express.Router();

router.post("/", accountController.createAccount);
//para liberar CORS em somente um endpoint basta adicionar a função cors da biblioteca cors na função especifica.
router.get("/", cors(), accountController.getAccounts);
router.get("/:id", accountController.getAccountsById);
router.delete("/:id", accountController.deleteAccount);
router.put("/", accountController.updateAccount);
router.patch("/updateBalance", accountController.updateBalance);

router.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
  console.log(err);
  res.status(500).send({error: err.message});
});

export default router;
