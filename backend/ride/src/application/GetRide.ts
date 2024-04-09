import RideDAO from "../infra/RideDAO";

export default class GetRide {
  
  constructor (readonly rideDao: RideDAO) {}

  async execute(rideId: string): Promise<any>{
    const ride = await this.rideDao.findById(rideId);
    if(!ride) throw new Error("Ride not exists");
    return ride;
  }
};