import nodemailer from 'nodemailer';
import logger from './logger';

const emailUser = process.env.EMAIL_USER || 'jorge0481rd@gmail.com';
const emailFrom = process.env.EMAIL_FROM || 'Leury Gym';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_PORT || 465),
  secure: String(process.env.EMAIL_SECURE ?? 'true') === 'true',
  auth: {
    user: emailUser,
    pass: process.env.EMAIL_PASS || 'euxl gigm afzs xxwu',
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export const verificarConexionMailer = async () => {
  try {
    await transporter.verify();
    logger.info('SMTP del mailer verificado correctamente');
    return true;
  } catch (error) {
    logger.warn('No se pudo verificar el SMTP del mailer:', error);
    return false;
  }
};

export const enviarEmail = async (
  destinatario: string,
  asunto: string,
  html: string
) => {
  try {
    if (!destinatario) {
      throw new Error('No se especificó un destinatario para el email');
    }

    await transporter.sendMail({
      from: `"${emailFrom}" <${emailUser}>`,
      to: destinatario,
      subject: asunto,
      html,
    });

    logger.info(`Email enviado correctamente a: ${destinatario}`);
    return true;
  } catch (error) {
    logger.error(`Error al enviar email a ${destinatario}:`, error);
    throw error;
  }
};