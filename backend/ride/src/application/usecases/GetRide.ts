import RideRepository from "../../infra/repositories/RideRepository";

export default class GetRide {
  
  constructor (readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<any>{
    const ride = await this.rideRepository.findById(rideId);
    if(!ride) throw new Error("Ride not exists");
    return ride;
  }
};