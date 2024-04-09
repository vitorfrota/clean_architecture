export default interface AccountGateway {
  findById(accountId: string): Promise<any>;
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
  
}