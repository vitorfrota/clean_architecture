import AccountDAO from "../driven/AccountDAO";

export default class GetAccount {
  constructor(readonly accountDao: AccountDAO) {}

  async execute(accountId: string): Promise<any>{
    const account = await this.accountDao.findById(accountId);
    if(!account) throw new Error("Account not exists");
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