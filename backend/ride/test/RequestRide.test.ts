import sinon from "sinon";
import { AccountGatewayInMemory } from "../src/infra/gateways/AccountGateway";
import RequestRide from "../src/application/usecases/RequestRide";
import { RideRepositoryDatabase, RideRepositoryInMemory } from "../src/infra/repositories/RideRepository";
import GetRide from "../src/application/usecases/GetRide";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";

let databaseConnection: DatabaseConnection;
let getRide: GetRide;
let input: any;
let requestRide: RequestRide;
let stubAccountGateway: sinon.SinonStub;

beforeEach(()=> {
  databaseConnection = new PgPromiseAdapter();
  const accountGateway = new AccountGatewayInMemory();
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  stubAccountGateway = sinon.stub(AccountGatewayInMemory.prototype, "findById");
  getRide = new GetRide(rideRepository);
  requestRide = new RequestRide(rideRepository, accountGateway);
  input = {
    passengerId: crypto.randomUUID(),
    from: { lat: -3.0284276, long: -59.9696824 },
    to: { lat: -52.2696824, long: -2.4126824 },
  };
})

test("Deve solicitar uma corrida", async function(){
  stubAccountGateway.resolves({ accountId: input.passengerId, isPassenger: true, isDriver: false });
  const outputRequestRide = await requestRide.execute(input);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("requested");
});


test("Não deve solicitar uma corrida para uma conta inexistente", async function(){
  stubAccountGateway.resolves(null);
  await expect(()=> requestRide.execute(input)).rejects.toThrow("Account not exists");
});

test("Não deve solicitar uma corrida se a conta não for de passageiro", async function(){
  stubAccountGateway.resolves({ accountId: input.passengerId, isPassenger: false, isDriver: true });
  await expect(()=> requestRide.execute(input)).rejects.toThrow("Account is not passenger");
});

test("Não deve solicitar uma corrida se já existir uma outra corrida com status diferente de completed", async function(){
  stubAccountGateway.resolves({ accountId: input.passengerId, isPassenger: true, isDriver: false });
  await requestRide.execute(input);
  await expect(()=> requestRide.execute(input)).rejects.toThrow("Ride already exists");
});

afterEach(()=> {
  stubAccountGateway.restore();
  databaseConnection.close();
});