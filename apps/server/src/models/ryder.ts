import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import { db } from '../config';

const TABLE_NAME = 'Ryder';

export const role = {
  RYDER: 'Rider',
} as const;
export type RoleType = (typeof role)[keyof typeof role];

// https://sequelize.org/docs/v6/other-topics/typescript/
class Ryder extends Model<
  InferAttributes<Ryder>,
  InferCreationAttributes<Ryder>
> {
  declare id: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare city: string;
  declare profilePic: string | null;
  declare password: string;
  declare phone: string;
  declare role: RoleType;
  declare verifyEmailToken: string;
  declare bikeDoc: string;
  declare validIdCard: string;
  declare passportPhoto: string;
  declare resetToken: CreationOptional<string>;
  declare resetTokenExpiry: CreationOptional<Date>;
  declare isVerified: boolean;
}

Ryder.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(role)),
    },
    verifyEmailToken: {
      type: DataTypes.STRING,
    },
    profilePic: {
      type: DataTypes.STRING,
    },
    bikeDoc: {
      type: DataTypes.STRING,
    },
    validIdCard: {
      type: DataTypes.STRING,
    },
    passportPhoto: {
      type: DataTypes.STRING,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default Ryder;
