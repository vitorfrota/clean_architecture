import sinon from "sinon";
import DatabaseConnection, { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";
import RequestRide from "../src/application/usecases/RequestRide";
import { AccountGatewayInMemory } from "../src/infra/gateways/AccountGateway";
import { RideRepositoryDatabase, RideRepositoryInMemory } from "../src/infra/repositories/RideRepository";
import GetRide from "../src/application/usecases/GetRide";
import AcceptRide from "../src/application/usecases/AcceptRide";
import StartRide from "../src/application/usecases/StartRide";

let databaseConnection: DatabaseConnection;
let acceptRide: AcceptRide;
let getRide: GetRide;
let input: any;
let requestRide: RequestRide;
let startRide: StartRide;
let stubAccountGateway: sinon.SinonStub;

beforeEach(()=> {
  databaseConnection = new PgPromiseAdapter();
  const accountGateway = new AccountGatewayInMemory();
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  stubAccountGateway = sinon.stub(AccountGatewayInMemory.prototype, "findById");
  acceptRide = new AcceptRide(rideRepository, accountGateway);
  getRide = new GetRide(rideRepository);
  requestRide = new RequestRide(rideRepository, accountGateway);
  startRide = new StartRide(rideRepository);
  input = {
    from: { lat: -3.0284276, long: -59.9696824 },
    to: { lat: -52.2696824, long: -2.4126824 },
  };
})

test("Deve iniciar uma corrida", async function() {
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
  await startRide.execute(outputRequestRide.rideId);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('in_progress');
});

test("Não deve iniciar uma corrida caso não tenha sido aceita por um motorista", async function() {
  const passengerId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: passengerId, isPassenger: true, isDriver: false });
  const outputRequestRide = await requestRide.execute({ ...input, passengerId });
  const driverId = crypto.randomUUID();
  stubAccountGateway.resolves({ accountId: driverId, isPassenger: false, isDriver: true });
  await expect(() => startRide.execute(outputRequestRide.rideId)).rejects.toThrow('Ride is not accepted');
});

afterEach(()=> {
  stubAccountGateway.restore();
  databaseConnection.close();
});