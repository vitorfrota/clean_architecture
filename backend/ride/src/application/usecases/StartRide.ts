import RideRepository from "../../infra/repositories/RideRepository";

export default class StartRide {
  
  constructor(readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<void> {
    const ride = await this.rideRepository.findById(rideId);
    if(!ride) throw new Error("Ride is not exists");
    ride.start();
    await this.rideRepository.update(ride);
  }
}