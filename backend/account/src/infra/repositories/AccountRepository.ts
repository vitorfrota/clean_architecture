import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface AccountRepository {
  findByEmail(email: string): Promise<Account | undefined>;
  findById(accountId: string): Promise<Account>;
  save(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

  constructor(readonly connection: DatabaseConnection) {}

  async findByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query("select * from cccat16.account where email = $1", [email]);
    if(!account) return;
    return Account.restore(account.account_id, account.name, account.cpf, account.email, account.is_passenger, account.is_driver, account.password, account.car_plate);
  }
  async findById(accountId: string): Promise<Account> {
    const [account] = await this.connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    return Account.restore(account.account_id, account.name, account.cpf, account.email, account.is_passenger, account.is_driver, account.password, account.car_plate);
  }

  async save(account: Account): Promise<void> {
    await this.connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
  }
  
}