export default class Ride {

  private constructor (
    readonly rideId: string, 
    readonly passengerId: string, 
    readonly fromLat: number, 
    readonly fromLong: number, 
    readonly toLat: number, 
    readonly toLong: number, 
    readonly date: Date, 
    readonly status: string
  ) {}

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const date = new Date();
    const status = "requested";
    return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, date, status);
  }

  static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date, status: string) {
    return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, date, status);
  }
}
