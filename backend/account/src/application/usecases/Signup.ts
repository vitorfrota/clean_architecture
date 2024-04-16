import Account from "../../domain/Account";
import AccountRepository from "../../infra/repositories/AccountRepository";
import MailerGateway from "../../infra/gateways/MailerGateway";

export default class Signup {
  constructor(readonly accountRepository: AccountRepository, readonly mailerGateway: MailerGateway) {}

  async execute(input: Input): Promise<Output> {
    const existingAccount = await this.accountRepository.findByEmail(input.email);
    if(existingAccount) throw new Error("Account already exists");
    const account = Account.create(input.name, input.cpf, input.email, input.isPassenger, input.isDriver, input.password, input.carPlate);
    await this.accountRepository.save(account);
    await this.mailerGateway.send(input.email, "Welcome!");
    return { 
      accountId: account.accountId
    };
  }
}

type Input = {
  carPlate?: string;
  cpf: string;
  email: string;
  isDriver: boolean;
  isPassenger: boolean;
  name: string;
  password: string;
}

type Output = {
  accountId: string;
}