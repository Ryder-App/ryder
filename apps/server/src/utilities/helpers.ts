import { Request } from 'express';
import { ENV } from '../config';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

export const passwordUtils = {
  length: 8,
  regex: ENV.IS_PROD
    ? /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.&])[A-Za-z\d@$!%*?.&]{8,}$/
    : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?.&])[A-Za-z\d@$!%*?.&]{8,}$/,
  error: ENV.IS_PROD
    ? 'Password: Min 8 characters, with an uppercase, a lowercase, a number, and a special character.'
    : 'Password: Min 8 characters, with an uppercase, a lowercase, a number, and a special character.',
};

export class PasswordHarsher {
  static async compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  static async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

export const generateLongString = (length: number): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const validatePassword = (password: string) => {
  if (!passwordUtils.regex.test(password)) {
    throw new Error(passwordUtils.error);
  }
};

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV.GMAIL_USER,
    pass: ENV.GMAIL_PASSWORD,
  },
});

export const sendRegistrationEmail = async (
  to: string,
  user: { firstName: string; lastName: string },
  url: string
) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Get started with the Ryder App - Confirm your email',
    text: `Hi ${user.firstName} ${user.lastName},\n\nWelcome to Ryder App! We're excited to have you on board.\n\nThank you for registering. Please use the following link to complete your registration:\n\n${url}\n\nIf you have any questions or need assistance, feel free to contact our support team.\n\nBest regards,\nThe [Your Platform Name] Team.`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent:' + info.response);
};

export function endsWithFileExtension(str: string) {
  return /\.(pdf|png|svg|jpg|jpeg)\b/i.test(str);
}

export async function uploadFile(fieldName: string, req: Request) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!files[fieldName] || files[fieldName].length === 0) {
    throw new Error(`File '${fieldName}' is missing`);
  }

  const filePath = files[fieldName][0].path;

  return filePath;
}
