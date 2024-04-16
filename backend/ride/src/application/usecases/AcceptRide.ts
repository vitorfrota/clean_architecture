import AccountGateway from "../../infra/gateways/AccountGateway";
import RideRepository from "../../infra/repositories/RideRepository";

export default class AcceptRide {

  constructor(readonly rideRepository: RideRepository, readonly accountGateway: AccountGateway) {}

  async execute(input: Input): Promise<void> {
    const account = await this.accountGateway.findById(input.driverId);
    if(!account.isDriver) throw new Error("Account is not a driver");
    const ride = await this.rideRepository.findById(input.rideId);
    if(!ride) throw new Error("Ride is not exists");
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
    if(hasActiveRide) throw new Error("Driver already has a accepted or in progress ride");
    ride.accept(input.driverId);
    await this.rideRepository.update(ride);
  }
}

type Input = {
  rideId: string;
  driverId: string;
}