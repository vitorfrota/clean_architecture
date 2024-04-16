import sinon from "sinon";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import RequestRide from "../src/application/usecases/RequestRide";
import { AccountGatewayInMemory } from "../src/infra/gateways/AccountGateway";
import { RideRepositoryDatabase, RideRepositoryInMemory } from "../src/infra/repositories/RideRepository";
import GetRide from "../src/application/usecases/GetRide";
import AcceptRide from "../src/application/usecases/AcceptRide";

let databaseConnection: DatabaseConnection;
let acceptRide: AcceptRide;
let getRide: GetRide;
let input: any;
let requestRide: RequestRide;
let stubAccountGateway: sinon.SinonStub;

beforeEach(()=> {
  databaseConnection = new PgPromiseAdapter();
  const accountGateway = new AccountGatewayInMemory();
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  stubAccountGateway = sinon.stub(AccountGatewayInMemory.prototype, "findById");
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository);
  requestRide = new RequestRide(rideRepository, accountGateway);
  input = {
    from: { lat: -3.0284276, long: -59.9696824 },
    to: { lat: -52.2696824, long: -2.4126824 },
  };
})

test("Deve aceitar uma corrida", async function() {
  const passengerId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: passengerId, isPassenger: true, isDriver: false });
  const outputRequestRide = await requestRide.execute({ ...input, passengerId });
  const driverId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: driverId, isPassenger: false, isDriver: true });
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId
  }
  await acceptRide.execute(inputAcceptRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
});

test("Não deve aceitar uma corrida caso motorista esteja com outra em andamento", async function() {
  const passengerId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: passengerId, isPassenger: true, isDriver: false });
  const outputRequestRide = await requestRide.execute({ passengerId, ...input });
  const driverId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: driverId, isPassenger: false, isDriver: true });
  const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId };
  await acceptRide.execute(inputAcceptRide);
  await expect(()=> acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Driver already has a accepted or in progress ride"));
});

test("Não deve aceitar uma corrida caso a conta não seja de motorista", async function() {
  const passengerId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: passengerId, isPassenger: true, isDriver: false });
  const outputRequestRide = await requestRide.execute({ passengerId, ...input });
  const driverId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: driverId, isPassenger: true, isDriver: false });
  const inputAcceptRide = { rideId: outputRequestRide.rideId, driverId };
  await expect(()=> acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error("Account is not a driver"));
});

afterEach(()=> {
  stubAccountGateway.restore();
  databaseConnection.close();
});