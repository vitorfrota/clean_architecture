import DatabaseConnection from "../infra/database";

export default class GetAccount {
  constructor(readonly connection: DatabaseConnection) {
    this.connection = connection;
  }

  async execute(accountId: string): Promise<Output>{
    const [account] = await this.connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    if(!account) throw new Error("-1");
    return {
      carPlate: account.car_plate,
      cpf: account.cpf,
      email: account.email,
      isDriver: account.is_driver,
      isPassenger: account.is_passenger,
      name: account.name
    }
  }
}

type Output = {
  carPlate: string;
  cpf: string;
  email: string;
  isDriver: boolean;
  isPassenger: boolean;
  name: string;
}