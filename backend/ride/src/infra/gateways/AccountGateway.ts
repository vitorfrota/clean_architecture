import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
  create(account: AccountDTO): Promise<any>;
  findById(accountId: string): Promise<any>;
}

export class AccountGatewayHttp implements AccountGateway {
  url = 'http://localhost:3000';

  constructor(readonly httpClient: HttpClient) {}
  
  async findById(accountId: string): Promise<any> {
    return this.httpClient.get(`${this.url}/${accountId}`);
  }

  async create(account: AccountDTO): Promise<any> {
    return this.httpClient.post(`${this.url}/signup`, account);
  } 

}

export class AccountGatewayInMemory implements AccountGateway {
  private accounts: any[];

  constructor () {
    this.accounts = [];
  }
  async findById(accountId: string): Promise<any> {
    const account = this.accounts.find(account=> account.accountId === accountId);
    return account;
  }

  async create(account: AccountDTO): Promise<any> {
    this.accounts.push(account);
  } 

}

type AccountDTO = {
  carPlate?: string;
  cpf: string;
  email: string;
  isDriver: boolean;
  isPassenger: boolean;
  name: string;
  password: string;
}