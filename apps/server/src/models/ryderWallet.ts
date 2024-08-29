import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { db } from '../config';

const TABLE_NAME = 'RyderWallet';

// https://sequelize.org/docs/v6/other-topics/typescript/
class RyderWallet extends Model<
  InferAttributes<RyderWallet>,
  InferCreationAttributes<RyderWallet>
> {
  declare id: string;
  declare ryderId: string;
  declare totalEarnings: number;
  declare noOfRides: number;
  declare totalRideTime: string;
  declare earnings: number;
}

RyderWallet.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    ryderId: {
      type: DataTypes.STRING,
    },
    totalEarnings: {
      type: DataTypes.INTEGER,
    },
    noOfRides: {
      type: DataTypes.INTEGER,
    },
    totalRideTime: {
      type: DataTypes.STRING,
    },
    earnings: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default RyderWallet;
