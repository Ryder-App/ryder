import { Response } from "express";
import { JwtPayload } from 'jsonwebtoken'
import { StatusCodes } from "http-status-codes";
import Ryder from "../../models/ryder";
import asyncHandler from "../../middleware/asyncHandler";

export const getRiderDetails = asyncHandler(
  async (_req: JwtPayload, res: Response) => {
    const riders = await Ryder.findAll();

    return res.status(StatusCodes.OK).json({
      message: "List of Riders",
      riders: riders.map((rider) => ({
        id: rider.id,
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
        phone: rider.phone,
        city: rider.city,
        isVerified: rider.isVerified,
      })),
    });
  }
);

export default getRiderDetails;
