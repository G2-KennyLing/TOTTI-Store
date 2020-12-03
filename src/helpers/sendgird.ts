import * as sgMail from "@sendgrid/mail";
interface Msg {
  to: string;
  from: {
    name: string;
    email: string;
  };
  subject: string;
  template_id: string;
  dynamic_template_data: any;
}
export default class SendGrid {
  private mailer: sgMail.MailService = sgMail;
  constructor(apiKey: string) {
    this.mailer.setApiKey(apiKey);
  }
  public sendGmailWithTemplate(msg: sgMail.MailDataRequired): any {
    return this.mailer.send(msg);
  }
}
