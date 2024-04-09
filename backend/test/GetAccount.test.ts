import GetAccount from "../src/application/GetAccount";
import { AccountDAODatabase } from "../src/driven/AccountDAO";
import Signup from "../src/application/Signup";
import { MailerGatewayMemory } from "../src/driven/MailerGateway";
import sinon from "sinon";

describe("GetAccount GET tests", function () {
  test('It should get a existing user', async function () {
    const accountDao = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();

    const mailerSpy = sinon.spy(MailerGatewayMemory.prototype, "send");

    const input = {
      name: "Vitor Teste",
      email: `vitor_${Math.random()}@example.com`,
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
      password: "123123"
    };

    const signup = new Signup(accountDao, mailerGateway);
    const getAccount = new GetAccount(accountDao);
    const outputSignup = await signup.execute(input);

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(mailerSpy.calledOnce).toBe(true);
  });
});