import { Sequelize, DataTypes, Model } from 'sequelize';
import * as pg from 'pg';
import createUserModel from '../models/User';
import createInspirationModel from '../models/Inspiration';

export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
});

export const User = createUserModel(sequelize);
export const Inspiration = createInspirationModel(sequelize);


export class Favorite extends Model {
  declare userId: number;
  declare inspirationId: number;
}

Favorite.init({
  userId: { type: DataTypes.INTEGER, primaryKey: true },
  inspirationId: { type: DataTypes.INTEGER, primaryKey: true },
}, { sequelize, modelName: 'Favorite', tableName: 'favorites' });

User.hasMany(Inspiration, { foreignKey: 'userId' });
Inspiration.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Inspiration, { through: Favorite, foreignKey: 'userId', as: 'bookmarkedPins' });
Inspiration.belongsToMany(User, { through: Favorite, foreignKey: 'inspirationId' });

if (process.env.NODE_ENV !== 'production') {
  sequelize.sync({ alter: true }).then(() => console.log("✅ DB bereit"));
}