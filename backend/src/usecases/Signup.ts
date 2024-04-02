import { validate as isValidCpf } from "../validateCpf";
import DatabaseConnection from "../infra/database";

export default class Signup {
  constructor(readonly connection: DatabaseConnection) {
    this.connection = connection;
  }

  async execute(input: Input): Promise<Output> {
    const { carPlate, cpf, name, email, isDriver, isPassenger, password } = input;
    const [account] = await this.connection.query("select * from cccat16.account where email = $1", [email]);
    if(account) throw new Error("-4");
    if(!isValidName(name)) throw new Error("-3");
    if(!isValidEmail(email)) throw new Error("-2");
    if(!isValidCpf(cpf)) throw new Error("-1");
    if(!isValidPassword(password)) throw new Error("-6");
    if(isDriver && !isValidCarPlate(carPlate)) throw new Error("-5");
    const accountId = crypto.randomUUID();
    await this.connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [accountId, name, email, cpf, carPlate, !!isPassenger, !!isDriver, password]);
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

type Input = {
  carPlate?: string;
  cpf: string;
  email: string;
  isDriver: boolean;
  name: string;
  isPassenger: boolean;
  password: string;
}

type Output = {
  accountId: string;
}