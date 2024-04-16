import sinon from "sinon";
import GetAccount from "../src/application/usecases/GetAccount";
import { AccountRepositoryDatabase } from "../src/infra/repositories/AccountRepository";
import Signup from "../src/application/usecases/Signup";
import { MailerGatewayMemory } from "../src/infra/gateways/MailerGateway";
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";

describe("GetAccount GET tests", function () {
  test('It should get a existing user', async function () {
    const databaseConnection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(databaseConnection);
    const mailerGateway = new MailerGatewayMemory();

    const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");

    const input = {
      name: "Vitor Teste",
      email: `vitor_${Math.round(Math.random() * 1000)}@example.com`,
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
      password: "123123"
    };

    const signup = new Signup(accountRepository, mailerGateway);
    const getAccount = new GetAccount(accountRepository);
    const outputSignup = await signup.execute(input);

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(mailerSpy.calledOnce).toBe(true);

    await databaseConnection.close();
  });
});