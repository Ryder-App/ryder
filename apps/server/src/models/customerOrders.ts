import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { db } from '../config';

const TABLE_NAME = 'CustomerOrders';

export enum Status {
  PENDING = 'pending',
  DELIVERED = 'delivered',
}

// https://sequelize.org/docs/v6/other-topics/typescript/
class CustomerOrders extends Model<
  InferAttributes<CustomerOrders>,
  InferCreationAttributes<CustomerOrders>
> {
  declare id: string;
  declare customerId: string;
  declare totalOrders: string;
  declare status: 'pending' | 'delivered';
  declare orderNumber: number;
  declare pickUpLocation: string;
  declare dropOffLocation: string;
  declare dropOffPhoneNumber: number;
  declare offer: number;
}

CustomerOrders.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.STRING,
    },
    totalOrders: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    orderNumber: {
      type: DataTypes.STRING,
    },
    pickUpLocation: {
      type: DataTypes.STRING,
    },
    dropOffLocation: {
      type: DataTypes.STRING,
    },
    dropOffPhoneNumber: {
      type: DataTypes.STRING,
    },
    offer: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default CustomerOrders;
