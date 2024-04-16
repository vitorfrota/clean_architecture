import Ride from "../../domain/Ride";
import RideRepository from "../../infra/repositories/RideRepository";
import AccountGateway from "../../infra/gateways/AccountGateway";

export default class RequestRide {

  constructor (readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {}

  async execute(input: Input): Promise<Output>{
    const account = await this.accountGateway.findById(input.passengerId);
    if(!account) throw new Error("Account not exists");
    if(!account.isPassenger) throw new Error("Account is not passenger");
    const existingRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
    if(existingRide) throw new Error("Ride already exists");
    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId
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