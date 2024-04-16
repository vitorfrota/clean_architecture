import AccountRepository from "../../infra/repositories/AccountRepository";

export default class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountId: string): Promise<Output>{
    const account = await this.accountRepository.findById(accountId);
    if(!account) throw new Error("Account not exists");
    return {
      carPlate: account.carPlate,
      cpf: account.cpf,
      email: account.email,
      isDriver: account.isDriver,
      isPassenger: account.isPassenger,
      name: account.name
    }
  }
}

type Output = {
  carPlate?: string;
  cpf: string; 
  email: string;
  isDriver: boolean;
  isPassenger: boolean;
  name: string; 
}