import GetAccount from "./application/usecases/GetAccount";
import Signup from "./application/usecases/Signup";
import { AccountRepositoryDatabase } from "./infra/repositories/AccountRepository";
import { MailerGatewayMemory } from "./infra/gateways/MailerGateway";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HttpServer";
import MainController from "./infra/http/MainController";

const databaseConnection = new PgPromiseAdapter();
const httpServer = new ExpressAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const mailerGateway = new MailerGatewayMemory();
const getAccount = new GetAccount(accountRepository);
const signupUseCase = new Signup(accountRepository, mailerGateway);
new MainController(httpServer, signupUseCase, getAccount);
httpServer.listen(3000);