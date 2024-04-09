import express from "express";
import GetAccount from "../application/GetAccount";
import Signup from "../application/Signup";
import { AccountDAODatabase } from "../driven/AccountDAO";
import { MailerGatewayMemory } from "../driven/MailerGateway";

const app = express();
app.use(express.json());

app.get("/account/:accountId", async function (request, response) {
 try {
  const { accountId } = request.params;
  const accountDao = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDao);
  const output = await getAccount.execute(accountId);
  return response.status(200).json(output);
 } catch (err: any) {
  return response.status(422).send(err.message + "");
 }
});

app.post("/signup", async function (request, response) {
	try {
    const accountDao = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signupUseCase = new Signup(accountDao, mailerGateway);
    const output = await signupUseCase.execute(request.body);
    response.status(200).json(output);
	} catch (err: any) {
    response.status(422).send(err.message + "");
  }
});

app.listen(3000);