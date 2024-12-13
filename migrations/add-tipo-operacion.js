// migrations/add-tipo-operacion.js
import Sequelize from 'sequelize';

export default {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('propiedades', 'tipoOperacion', {
            type: Sequelize.ENUM('venta', 'renta'),
            allowNull: false,
            defaultValue: 'venta'
        });
    },
    down: async (queryInterface) => {
        await queryInterface.removeColumn('propiedades', 'tipoOperacion');
    }
};