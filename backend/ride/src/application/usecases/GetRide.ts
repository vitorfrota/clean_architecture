import RideRepository from "../../infra/repositories/RideRepository";

export default class GetRide {
  
  constructor (readonly rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Output>{
    const ride = await this.rideRepository.findById(rideId);
    if(!ride) throw new Error("Ride not exists");

    return {
      fromLat: ride.fromLat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      passengerId: ride.passengerId,
      rideId: ride.rideId,
      status: ride.getStatus(),
    };
  }
};

type Output = {
  driverId?: string,
  rideId: string,
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	status: string,
}