import { Request, Response } from 'express';
import Ryder from '../../models/ryder';
import { editRiderProfileSchema } from '../../utilities/validators';
import { StatusCodes } from 'http-status-codes';

export const editRiderProfile = async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const userValidate = editRiderProfileSchema.strict().safeParse(req.body);

  if (!userValidate.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: 'Invalid user data',
      details: userValidate.error.issues,
    });
  }

  const { firstName, lastName, phone, email } = userValidate.data;

  try {
    const user = await Ryder.findByPk(userId);

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;

    await user.save();

    res.status(StatusCodes.OK).json({
      message: 'Profile updated successfully',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};
