import express from 'express';

export default interface HttpServer {
  listen(port: number): void;
  register(method: string, url: string, callback: Function): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor(){
    this.app = express();
    this.app.use(express.json());
  }

  listen(port: number): void {
    this.app.listen(port);
  }

  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async (request: any, response: any)=> {
      try {
        const output = await callback(request.params, request.body);
        return response.json(output);
      } catch (err: any) {
        return response.status(422).json({
          message: err.message
        });
      }
    });
  }
  
}