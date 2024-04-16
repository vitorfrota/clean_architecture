import crypto from "crypto";
import { validate as isValidCpf } from "./validateCpf";

export default class Account {

  private constructor(
    readonly accountId: string, 
    readonly name: string, 
    readonly cpf: string, 
    readonly email: string, 
    readonly isPassenger: boolean, 
    readonly isDriver: boolean, 
    readonly password: string,
    readonly carPlate?: string
  ) {
    if(!this.isValidName(this.name)) throw new Error("Invalid name");
    if(!this.isValidEmail(this.email)) throw new Error("Invalid email");
    if(!isValidCpf(this.cpf)) throw new Error("Invalid cpf");
    if(!this.isValidPassword(this.password)) throw new Error("Invalid password");
    if(this.isDriver && !this.isValidCarPlate(this.carPlate)) throw new Error("Invalid car plate");
  }

  static create(name: string, cpf: string, email: string, isPassenger: boolean, isDriver: boolean, password: string, carPlate?: string) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, cpf, email, isPassenger, isDriver, password, carPlate);
  }

  static restore(accountId: string, name: string, cpf: string, email: string, isPassenger: boolean, isDriver: boolean, password: string, carPlate?: string) {
    return new Account(accountId, name, cpf, email, isPassenger, isDriver, password, carPlate);
  }

  private isValidName(name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
  }
  
  private isValidEmail(email: string){
    return email.match(/^(.+)@(.+)$/);
  }
  
  private isValidCarPlate(carPlate: string | undefined) {
    if(!carPlate) return false;
    return carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }
  
  private isValidPassword(password: string) {
    return password.length >= 6;
  }

}