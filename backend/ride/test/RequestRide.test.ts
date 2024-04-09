import sinon from "sinon";
import { AccountGatewayInMemory } from "../src/application/AccountGateway";
import RequestRide from "../src/application/RequestRide";
import { RideDAOInMemory } from "../src/infra/RideDAO";
import GetRide from "../src/application/GetRide";

let getRide: GetRide;
let input: any;
let requestRide: RequestRide;
let stubAccountGateway: sinon.SinonStub;

beforeEach(()=> {
  const accountGateway = new AccountGatewayInMemory();
  const rideDAO = new RideDAOInMemory();
  stubAccountGateway = sinon.stub(AccountGatewayInMemory.prototype, "findById");
  getRide = new GetRide(rideDAO);
  requestRide = new RequestRide(rideDAO, accountGateway);
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
  expect(outputGetRide.ride_id).toBe(outputRequestRide.rideId);
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
});