export default interface MailerGateway {
  send(subject: string, content: string): Promise<void>;
}

export class MailerGatewayMemory implements MailerGateway {
  async send(subject: string, content: string): Promise<void> {
    console.log(subject, content);
  }
  
}