import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
  findById(rideId: string): Promise<Ride | undefined>;
  findByPassengerId(passengerId: string): Promise<Ride | undefined>;
  save(ride: Ride): Promise<void>;
}

export class RideRepositoryInMemory implements RideRepository {
  private rides: Ride[];

  constructor () {
    this.rides = [];
  }

  async findById(rideId: string): Promise<Ride | undefined> {
    const ride = this.rides.find(ride=> ride.rideId === rideId);
    return ride;
  }

  async findByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const ride = this.rides.find(ride=> ride.passengerId === passengerId);
    return ride;
  }

  async save(ride: Ride): Promise<void> {
    this.rides.push(ride);
  }
  
}

export class RideRepositoryDatabase implements RideRepository {

  constructor (readonly connection: DatabaseConnection) {}

  async findById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
    if(!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.date, ride.status);
  }

  async findByPassengerId(passengerId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query("select * from cccat16.ride where passenger_id = $1", [passengerId]);
    if(!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.date, ride.status);
  }

  async save(ride: Ride): Promise<void> {
    await this.connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, date, status) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date, ride.status]);
  }
  
}