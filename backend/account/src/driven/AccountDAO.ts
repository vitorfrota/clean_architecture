import pgp from "pg-promise";

export default interface AccountDAO {
  findByEmail(email: string): Promise<any>;
  findById(accountId: string): Promise<any>;
  save(account: string): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {

  async findByEmail(email: string): Promise<any> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    const [account] = await connection.query("select * from cccat16.account where email = $1", [email]);
    await connection.$pool.end();
    return account;
  }
  async findById(accountId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    const [account] = await connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return account;
  }

  async save(account: any): Promise<void> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.password]);
    await connection.$pool.end();
  }
  
}