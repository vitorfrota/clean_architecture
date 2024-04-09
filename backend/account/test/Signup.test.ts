import { AccountDAODatabase } from "../src/driven/AccountDAO";
import Signup from "../src/application/Signup";
import GetAccount from "../src/application/GetAccount";
import { MailerGatewayMemory } from "../src/driven/MailerGateway";

describe("Signup POST tests", function () {
  test('It should create a passenger user', async function () {
    const accountDao = new AccountDAODatabase();
    const mailerGateway = new MailerGatewayMemory();

    const input = {
      name: "Vitor Hugo",
      email: `vitor_${Math.random()}@example.com`,
      cpf: "15987930200",
      isDriver: false,
      isPassenger: true,
      password: "123456"
    };

    const signup = new Signup(accountDao, mailerGateway);
    const getAccount = new GetAccount(accountDao);
    const outputSignup = await signup.execute(input);

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);
  
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
  });
});