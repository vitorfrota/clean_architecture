import { validate as isValidCpf } from "../validateCpf";
import AccountDAO from "../driven/AccountDAO";
import MailerGateway from "../driven/MailerGateway";

export default class Signup {
  constructor(readonly accountDao: AccountDAO, readonly mailerGateway: MailerGateway) {}

  async execute(input: any): Promise<any> {
    const account = await this.accountDao.findByEmail(input.email);
    if(account) throw new Error("Account already exists");
    if(!isValidName(input.name)) throw new Error("Invalid name");
    if(!isValidEmail(input.email)) throw new Error("Invalid email");
    if(!isValidCpf(input.cpf)) throw new Error("Invalid cpf");
    if(!isValidPassword(input.password)) throw new Error("Invalid password");
    if(input.isDriver && !isValidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
    const accountId = crypto.randomUUID();
    await this.accountDao.save({ accountId, ...input });
    await this.mailerGateway.send(input.email, "Welcome!");
    return { accountId };
  }
}

function isValidName(name: string) {
  return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail(email: string){
  return email.match(/^(.+)@(.+)$/);
}

function isValidCarPlate(carPlate: string | undefined) {
  if(!carPlate) return false;
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

function isValidPassword(password: string) {
  return password.length >= 6;
}