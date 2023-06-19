import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendEmail(to: string, subject: string, text: string) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'juanpc3399@gmail.com',
      to,
      subject,
      text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Correo enviado:', info.response);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}
