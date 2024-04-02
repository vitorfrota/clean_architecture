import pgp from "pg-promise";

export default class DatabaseConnection {
  private connection;
  constructor(){
    this.connection = pgp()("postgres://postgres:postgres@localhost:5433/cccat");
  }

  async query(query: string, params: any[]) {
    return this.connection.query(query, params);
  }

  async end() {
    return this.connection.$pool.end();
  }
}