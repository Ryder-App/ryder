import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { db } from '../config';

const TABLE_NAME = 'Card';

// https://sequelize.org/docs/v6/other-topics/typescript/
class Card extends Model<InferAttributes<Card>, InferCreationAttributes<Card>> {
  declare id: string;
  declare cardNumber: number;
  declare cardName: string;
  declare expiryDate: Date;
  declare cvv: number;
}

Card.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    cardNumber: {
      type: DataTypes.INTEGER,
    },
    cardName: {
      type: DataTypes.STRING,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
    cvv: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    modelName: TABLE_NAME,
    timestamps: true,
  }
);

export default Card;
