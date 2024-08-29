import z from 'zod';
import { passwordUtils } from '../helpers';

export const customerRegisterSchema = z.object({
  firstName: z.string().min(2, 'firstname is required'),
  lastName: z.string().min(2, 'lastname is required'),
  email: z.string().email({ message: 'email is invalid' }),
  phone: z.string().min(11, 'phone number is required'),
  password: z.string().min(5, passwordUtils.error),
});
export const riderRegisterSchema = z.object({
  firstName: z.string().min(2, 'firstname is required'),
  lastName: z.string().min(2, 'lastname is required'),
  email: z.string().email({ message: 'email is invalid' }),
  phone: z.string().min(11, 'phone number is required'),
  city: z.string().min(1, 'city is required'),
  password: z.string().min(5, passwordUtils.error),
});

export const editRiderProfileSchema = z.object({
  firstName: z.string().min(2, 'firstname is required'),
  lastName: z.string().min(2, 'lastname is required'),
  email: z.string().email({ message: 'email is invalid' }),
  phone: z.string().min(11, 'phone number is required'),
});
