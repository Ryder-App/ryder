import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { v4 as uuidV4 } from 'uuid';
import { StatusCodes } from 'http-status-codes';
import {
  passwordUtils,
  PasswordHarsher,
  validatePassword,
  generateLongString,
  uploadFile,
  sendRegistrationEmail,
} from '../../utilities/helpers';
import { riderRegisterSchema } from '../../utilities/validators';
import Ryder, { role } from '../../models/ryder';
import * as jwt from 'jsonwebtoken';
import ENV, { APP_SECRET } from '../../config/env';
import nodemailer from 'nodemailer';

export const registerRyder = async (req: Request, res: Response) => {
  const passwordRegex = passwordUtils.regex;

  try {
    const userValidate = riderRegisterSchema.strict().safeParse(req.body);

    if (userValidate.success) {
      const { firstName, lastName, email, phone, city, password } =
        userValidate.data;
      const newEmail = email.trim().toLowerCase();
      if (!passwordRegex.test(password)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: passwordUtils.error,
        });
      }

      const userExist = await Ryder.findOne({
        where: {
          [Op.or]: [{ email: newEmail }, { phone: phone }],
        },
      });
      if (!userExist) {
        const bikeDocUrl = await uploadFile('bikeDoc', req);
        const validIdCardUrl = await uploadFile('validIdCard', req);
        const passportPhotoUrl = await uploadFile('passportPhoto', req);

        const hashedPassword = await PasswordHarsher.hash(password);
        const id = uuidV4();
        const longString = generateLongString(50);

        const user = await Ryder.create({
          id,
          firstName,
          lastName,
          email: newEmail,
          city,
          phone,
          password: hashedPassword,
          role: role.RYDER,
          bikeDoc: bikeDocUrl,
          validIdCard: validIdCardUrl,
          passportPhoto: passportPhotoUrl,
          isVerified: false,
          verifyEmailToken: longString,
        });

        // Send registration email with user info
        const info = {
          firstName: user.firstName,
          lastName: user.lastName,
        };

        const url = `${process.env.FE_BASE_URL}/verify-email?token=${longString}`;

        await sendRegistrationEmail(user.email, info, url);

        return res.status(StatusCodes.OK).json({
          message: 'Registration Successful',
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        });
      } else {
        return res.status(StatusCodes.CONFLICT).send({
          message: 'This account already exist',
        });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: userValidate.error.issues,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: [
        { message: 'This is our fault, our team are working to resolve this.' },
      ],
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Email and password are required' });
  }

  try {
    const rider = await Ryder.findOne({ where: { email } });

    if (!rider) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Rider not found' });
    }

    const isValidPassword = await PasswordHarsher.compare(
      password,
      rider.password
    );

    if (!isValidPassword) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: 'Wrong password' });
    }

    const token = jwt.sign(
      {
        userId: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
        phone: rider.phone,
        role: rider.role,
      },
      `${APP_SECRET}`,
      {
        expiresIn: '1d',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(StatusCodes.OK).json({
      message: 'You have successfully logged in',
      role: rider.role,
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal Server Error' });
  }
};

export const RiderForgotPassword = async (req: Request, res: Response) => {
  try {
    let { email } = req.body;

    email = email.trim().toLowerCase();

    const user = await Ryder.findOne({ where: { email } });

    if (user) {
      const longString = generateLongString(80);

      user.resetToken = longString;
      user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);
      await user.save();

      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      // Compose the email content
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Reset your password',
        text: `Hi, ${user.firstName} ${user.lastName} \n\nPlease use the following link to reset your password \n\n  ${ENV.FE_BASE_URL}/reset-password?token=${longString} `,
      };

      // Send the email
      transporter.sendMail(mailOptions, (err, info: { response: string }) => {
        if (err) {
          console.log(err);
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:
              'Failed to send reset password email. Please try again later.',
          });
        } else {
          console.log('Email sent: ' + info.response);
          return res.status(StatusCodes.OK).json({
            message:
              'Password reset link has been sent to your email if you have an account with us.',
          });
        }
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'No valid user found with the provided email address.',
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'This is our fault, our team is working to resolve this.',
    });
  }
};

export const RiderResetPassword = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const token = req.query.token as string;

    const user = await Ryder.findOne({
      where: {
        resetToken: token,
      },
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message:
          'No reset token found for this valid user or the token has been used.',
      });
    }

    if (new Date() > user.resetTokenExpiry) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Password reset token has expired.',
      });
    }

    // Validate the new password
    try {
      validatePassword(newPassword);
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: (error as Error).message,
      });
    }

    const hashedPassword = await PasswordHarsher.hash(newPassword);

    user.password = hashedPassword;
    user.resetToken = '';
    user.resetTokenExpiry = new Date(0);
    await user.save();

    return res.status(StatusCodes.OK).json({
      message:
        'Password has been successfully reset. You can now login with your new password',
    });
  } catch (error) {
    console.log(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: [
        { message: 'This is our fault, our team is working to resolve this.' },
      ],
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { token } = req.query;

    const user = await Ryder.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'User not found' });
    }

    if (token !== user.verifyEmailToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: 'Token is invalid' });
    }

    user.isVerified = true;
    user.verifyEmailToken = '';

    await user.save();
    const username = `${user.firstName} ${user.lastName}`;

    res
      .status(StatusCodes.OK)
      .json({ message: 'User successfully verified', username });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Verification failed' });
  }
};
