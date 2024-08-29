import { Response } from "express";
import { JwtPayload } from 'jsonwebtoken'
import Ryder from "../../models/ryder";
import { editRiderProfileSchema } from "../../utilities/validators";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "../../middleware/asyncHandler";

const editRiderProfile = asyncHandler(
  async (req: JwtPayload, res: Response) => {
    const userId = req.params.userId;

    const userValidate = editRiderProfileSchema.strict().safeParse(req.body);

    if (!userValidate.success) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid user data",
        details: userValidate.error.issues,
      });
    }

    const { firstName, lastName, phone, email } = userValidate.data;

    const user = await Ryder.findByPk(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;

    await user.save();

    return res.status(StatusCodes.OK).json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userId: user.id,
      },
    });
  }
);

export default editRiderProfile;
