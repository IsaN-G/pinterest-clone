import { DataTypes, Model, Sequelize, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';


const createInspirationModel = (sequelize: Sequelize) => {
  class Inspiration extends Model<InferAttributes<Inspiration>, InferCreationAttributes<Inspiration>> {
    declare id: CreationOptional<number>;
    declare title: string;
    declare imageUrl: string;
    declare category: string;
    declare userId: number;
  }

  Inspiration.init({
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },

    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    
    imageUrl: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    
    category: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: 'mode' 
    },
    
    userId: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
  }, 
  { 
    sequelize, 
    modelName: 'Inspiration', 
    tableName: 'inspirations' 
  });

  return Inspiration;
};

export default createInspirationModel;

