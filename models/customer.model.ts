import { DataTypes, Model } from 'sequelize';
import sequelize from '../sequelize';

class Customer extends Model {
    customer_id: number;
    store_id: number;
    first_name: string;
    last_name: string;
    email: string;
    address_id: number;
    activebool: boolean;
    create_date: Date;
    last_update: Date;
    active: number;
}

Customer.init(
    {
        customer_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        store_id: {
            type: DataTypes.SMALLINT
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        email: {
            type: DataTypes.STRING
        },
        address_id: {
            type: DataTypes.SMALLINT
        },
        activebool: {
            type: DataTypes.BOOLEAN
        },
        create_date: {
            type: DataTypes.DATE
        },
        last_update: {
            type: DataTypes.DATE
        },
        active: {
            type: DataTypes.INTEGER
        },
    },
    {
        sequelize,
        modelName: 'Customer',
        tableName: 'customer',
        timestamps: false
    }
);

export default Customer;

