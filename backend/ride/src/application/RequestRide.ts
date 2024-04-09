import RideDAO from "../infra/RideDAO";
import AccountGateway from "./AccountGateway";

export default class RequestRide {

  constructor (readonly rideDao: RideDAO, readonly accountGateway: AccountGateway) {}

  async execute(input: Input): Promise<Output>{
    const account = await this.accountGateway.findById(input.passengerId);
    if(!account) throw new Error("Account not exists");
    if(!account.isPassenger) throw new Error("Account is not passenger");
    const existingRide = await this.rideDao.findByPassengerId(input.passengerId);
    if(existingRide && existingRide.status !== "completed") throw new Error("Ride already exists");
    const rideId = crypto.randomUUID();
    const ride = {
      ride_id: rideId,
      date: new Date(),
      from_lat: input.from.lat,
      from_long: input.from.long,
      to_lat: input.from.lat,
      to_long: input.from.long,
      passenger_id: input.passengerId,
      status: "requested"
    };
    await this.rideDao.save(ride);
    return {
      rideId
    };
  }
}

type Input = {
  passengerId: string;
  from: { lat: number, long: number };
  to: { lat: number, long: number };
}

type Output = {
  rideId: string;
}