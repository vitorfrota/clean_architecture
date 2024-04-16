import { AccountRepositoryDatabase } from "../src/infra/repositories/AccountRepository";
import Signup from "../src/application/usecases/Signup";
import GetAccount from "../src/application/usecases/GetAccount";
import { MailerGatewayMemory } from "../src/infra/gateways/MailerGateway";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";

describe("Signup POST tests", function () {
  test('It should create a passenger user', async function () {
    const databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const mailerGateway = new MailerGatewayMemory();

    const input = {
      name: "Vitor Hugo",
      email: `vitor_${Math.round(Math.random() * 1000)}@example.com`,
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
      password: "123456"
    };

    const signup = new Signup(accountRepository, mailerGateway);
    const outputSignup = await signup.execute(input);
    const getAccount = new GetAccount(accountRepository);
    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);

    await databaseConnection.close();
  });
});