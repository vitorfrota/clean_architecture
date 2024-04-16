import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export default interface RideRepository {
  findById(rideId: string): Promise<Ride | undefined>;
  hasActiveRideByDriverId(driverId: string): Promise<boolean>;
  hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
  save(ride: Ride): Promise<void>;
  update(ride: Ride): Promise<void>;
}

export class RideRepositoryInMemory implements RideRepository {
  private rides: Ride[];

  constructor () {
    this.rides = [];
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const ride = this.rides.find(ride=> ride.getDriverId() === driverId && ride.getStatus() !== 'completed');
    return !!ride;
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const ride = this.rides.find(ride=> ride.passengerId === passengerId && ride.getStatus() !== 'completed');
    return !!ride;
  }

  async findById(rideId: string): Promise<Ride | undefined> {
    const ride = this.rides.find(ride=> ride.rideId === rideId);
    return ride;
  }

  async save(ride: Ride): Promise<void> {
    this.rides.push(ride);
  }

  async update(ride: Ride): Promise<void> {
    const rideIndex = this.rides.findIndex(item=> item.rideId === ride.rideId);
    this.rides.slice(rideIndex, 1);
    this.rides.push(ride);
  }
  
}

export class RideRepositoryDatabase implements RideRepository {

  constructor (readonly connection: DatabaseConnection) {}

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const [ride] = await this.connection.query("select * from cccat16.ride where driver_id = $1 and status = 'accepted'", [driverId]);
    return !!ride;
  }

  async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
    const [ride] = await this.connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
    return !!ride;
  }

  async findById(rideId: string): Promise<Ride | undefined> {
    const [ride] = await this.connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
    if(!ride) return;
    return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.date, ride.status, ride.driver_id);
  }

  async save(ride: Ride): Promise<void> {
    await this.connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, date, status) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date, ride.getStatus()]);
  }

  async update (ride: Ride) {
		await this.connection.query("update cccat16.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.getDriverId(), ride.rideId]);
	}
  
}