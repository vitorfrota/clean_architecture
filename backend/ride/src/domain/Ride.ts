export default class Ride {

  private constructor (
    readonly rideId: string, 
    readonly passengerId: string, 
    readonly fromLat: number, 
    readonly fromLong: number, 
    readonly toLat: number, 
    readonly toLong: number, 
    readonly date: Date, 
    private status: string,
    private driverId?: string,
  ) {}

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const date = new Date();
    const status = "requested";
    return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, date, status);
  }

  static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date, status: string, driverId?: string) {
    return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, date, status, driverId);
  }

  accept(driverId: string){
    if(this.status !== 'requested') throw new Error('Ride is not requested');
    this.status = 'accepted';
    this.driverId = driverId;
  }

  start(){
    if(this.status !== 'accepted') throw new Error('Ride is not accepted');
    this.status = 'in_progress';
  }

  getDriverId() {
    return this.driverId;
  }

  getStatus(){
    return this.status;
  }
}
