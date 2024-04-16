import pgp from "pg-promise";

export default interface DatabaseConnection {
  close(): Promise<void>;
  query(statement: string, params: any): Promise<any>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  connection: any;

  constructor(){
    this.connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
  }

  close(): Promise<void> {
    return this.connection.$pool.end();
  }
  
  query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }
}