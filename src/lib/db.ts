import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import * as pg from 'pg';

// Verbindung zur PostgreSQL Datenbank
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectModule: pg, // Wichtig für Next.js/Vercel Umgebungen
  logging: false,
});

// --- USER MODEL ---
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password?: string;
}

type UserCreationAttributes= Optional<UserAttributes, 'id'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password?: string;
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true },
}, { sequelize, modelName: 'user' });

// --- INSPIRATION MODEL ---
interface InspirationAttributes {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
  userId: number;
}

type InspirationCreationAttributes= Optional<InspirationAttributes, 'id'>;

export class Inspiration extends Model<InspirationAttributes, InspirationCreationAttributes> implements InspirationAttributes {
  declare id: number;
  declare title: string;
  declare imageUrl: string;
  declare category: string;
  declare userId: number;
}

Inspiration.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
}, { sequelize, modelName: 'inspiration' });

// --- FAVORITE MODEL ---
interface FavoriteAttributes {
  userId: number;
  inspirationId: number;
}

export class Favorite extends Model<FavoriteAttributes> implements FavoriteAttributes {
  declare userId: number;
  declare inspirationId: number;
}

Favorite.init({
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    primaryKey: true 
  },
  inspirationId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    primaryKey: true 
  },
}, { 
  sequelize, 
  modelName: 'favorite' 
});


User.hasMany(Inspiration, { foreignKey: 'userId' });
Inspiration.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Inspiration, { through: Favorite, foreignKey: 'userId', as: 'bookmarkedPins' });

Inspiration.belongsToMany(User, { through: Favorite, foreignKey: 'inspirationId' });

sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Datenbank & Tabellen (inkl. Favorites) sind bereit.");
  })
  .catch((err) => {
    console.error("❌ Fehler beim Synchronisieren der Datenbank:", err);
  });