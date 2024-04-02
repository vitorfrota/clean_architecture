import express from "express";
import GetAccount from "./usecases/GetAccount";
import Signup from "./usecases/Signup";
import DatabaseConnection from "./infra/database";

const app = express();
app.use(express.json());

const databaseConnection = new DatabaseConnection();

app.get("/account/:accountId", async function (request, response) {
 try {
  const { accountId } = request.params;
  const getAccount = new GetAccount(databaseConnection);
  const output = await getAccount.execute(accountId);
  return response.status(200).json(output);
 } catch (err: any) {
  return response.status(422).send(err.message + "");
 }
});

app.post("/signup", async function (request, response) {
	try {
    const { carPlate, cpf, name, email, isDriver, isPassenger, password } = request.body;
    const signupUseCase = new Signup(databaseConnection);
    const output = await signupUseCase.execute({
      carPlate,
      cpf,
      name,
      email,
      isDriver,
      isPassenger,
      password
    });
    response.status(200).json(output);
	} catch (err: any) {
    response.status(422).send(err.message + "");
  }
});

app.listen(3000);