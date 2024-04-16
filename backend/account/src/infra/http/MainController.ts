import GetAccount from "../../application/usecases/GetAccount";
import Signup from "../../application/usecases/Signup";
import HttpServer from "./HttpServer";

export default class MainController {

  constructor (readonly httpServer: HttpServer, readonly signup: Signup, readonly getAccount: GetAccount) {
    this.httpServer.register('post', '/signup', async (params: any, body: any) => {
      const output = await this.signup.execute(body);
      return output;
    })

    this.httpServer.register('get', '/account/:accountId', async (params: any, body: any) => {
      const output = await this.getAccount.execute(params.accountId);
      return output;
    })
  }
}