import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuidV4 } from "uuid";
import { StatusCodes } from "http-status-codes";
import {
  passwordUtils,
  PasswordHarsher,
  validatePassword,
  generateLongString,
  uploadFile,
  sendRegistrationEmail,
} from "../../utilities/helpers/helpers";
import { riderRegisterSchema } from "../../utilities/validators";
import Ryder, { role } from "../../models/ryder";
import * as jwt from "jsonwebtoken";
import ENV, { APP_SECRET } from "../../config/env";
import nodemailer from "nodemailer";
import asyncHandler from "../../middleware/asyncHandler";
import winstonLogger from "../../utilities/helpers/winston";

const registerRyder = asyncHandler(async (req: Request, res: Response) => {
  const passwordRegex = passwordUtils.regex;

  const userValidate = riderRegisterSchema.strict().safeParse(req.body);

  if (!userValidate.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: userValidate.error.issues,
    });
  }

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
      [Op.or]: [{ email: newEmail }, { phone }],
    },
  });

  if (userExist) {
    return res.status(StatusCodes.CONFLICT).send({
      message: "This account already exists",
    });
  }

  const bikeDocUrl = await uploadFile("bikeDoc", req);
  const validIdCardUrl = await uploadFile("validIdCard", req);
  const passportPhotoUrl = await uploadFile("passportPhoto", req);

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

  const info = {
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const url = `${ENV.FE_BASE_URL}/verify-email?token=${longString}`;

  await sendRegistrationEmail(user.email, info, url);

  return res.status(StatusCodes.OK).json({
    message: "Registration Successful",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  });
});

const loginRyder = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Email and password are required" });
  }

  const rider = await Ryder.findOne({ where: { email } });

  if (!rider) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Rider not found" });
  }

  const isValidPassword = await PasswordHarsher.compare(
    password,
    rider.password
  );

  if (!isValidPassword) {
    return res.status(StatusCodes.CONFLICT).json({ message: "Wrong password" });
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
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(StatusCodes.OK).json({
    message: "You have successfully logged in",
    role: rider.role,
    token: token,
  });
});

const riderForgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    let { email } = req.body;

    email = email.trim().toLowerCase();

    const user = await Ryder.findOne({ where: { email } });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "No valid user found with the provided email address.",
      });
    }

    const longString = generateLongString(80);

    user.resetToken = longString;
    user.resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Reset your password",
      text: `Hi, ${user.firstName} ${user.lastName},\n\nPlease use the following link to reset your password:\n\n${ENV.FE_BASE_URL}/reset-password?token=${longString}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        winstonLogger.error(err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message:
            "Failed to send reset password email. Please try again later.",
        });
      } else {
        winstonLogger.info("Email sent: " + info.response);
        return res.status(StatusCodes.OK).json({
          message:
            "Password reset link has been sent to your email if you have an account with us.",
        });
      }
    });
  }
);

const riderResetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { newPassword } = req.body;
  const token = req.query.token as string;

  const user = await Ryder.findOne({
    where: {
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // Check if token is not expired
    },
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "No reset token found for this user or the token has expired.",
    });
  }

  validatePassword(newPassword);

  const hashedPassword = await PasswordHarsher.hash(newPassword);

  user.password = hashedPassword;
  user.resetToken = "";
  user.resetTokenExpiry = new Date(0);
  await user.save();

  return res.status(StatusCodes.OK).json({
    message:
      "Password has been successfully reset. You can now login with your new password.",
  });
});

const verifyUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { token } = req.query as { token: string };

  const user = await Ryder.findOne({
    where: { id: userId },
  });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found or token is invalid.",
    });
  }

  if (token !== user.verifyEmailToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Token is invalid",
    });
  }

  user.isVerified = true;
  user.verifyEmailToken = "";

  await user.save();
  const username = `${user.firstName} ${user.lastName}`;

  return res.status(StatusCodes.OK).json({
    message: "User successfully verified",
    username,
  });
});

export {
  registerRyder,
  loginRyder,
  riderForgotPassword,
  riderResetPassword,
  verifyUser,
};
