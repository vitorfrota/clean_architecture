import pgp from "pg-promise";

export default interface RideDAO {
  findById(rideId: string): Promise<any>;
  findByPassengerId(passengerId: string): Promise<any>;
  save(ride: any): Promise<void>;
}

export class RideDAOInMemory implements RideDAO {
  private rides: any[];

  constructor () {
    this.rides = [];
  }

  async findById(rideId: string): Promise<any> {
    const ride = this.rides.find(ride=> ride.ride_id === rideId);
    return ride;
  }

  async findByPassengerId(passengerId: string): Promise<any> {
    const ride = this.rides.find(ride=> ride.passenger_id === passengerId);
    return ride;
  }

  async save(ride: any): Promise<void> {
    this.rides.push(ride);
  }
  
}

export class RideDAODatabase implements RideDAO {

  async findById(rideId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    const [ride] = await connection.query("select * from cccat16.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();
    return ride;
  }

  async findByPassengerId(passengerId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    const [ride] = await connection.query("select * from cccat16.ride where passenger_id = $1", [passengerId]);
    await connection.$pool.end();
    return ride;
  }

  async save(ride: any): Promise<void> {
    const connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
    await connection.query("insert into cccat16.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, date, status) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.ride_id, ride.passenger_id, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.date, ride.status]);
    await connection.$pool.end();
  }
  
}