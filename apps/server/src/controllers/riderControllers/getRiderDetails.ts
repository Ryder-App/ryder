import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Ryder from '../../models/ryder';

export const getRiderDetails = async (_req: Request, res: Response) => {
  try {
    const riders = await Ryder.findAll();

    return res.status(StatusCodes.OK).json({
      message: 'List of Riders',
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
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to retrieve riders',
    });
  }
};

export default getRiderDetails;
