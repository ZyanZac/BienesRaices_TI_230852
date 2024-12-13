'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('propiedades', 'tipoOperacion', {
      type: Sequelize.ENUM('venta', 'renta'),
      allowNull: false,
      defaultValue: 'venta'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('propiedades', 'tipoOperacion');
    await queryInterface.sequelize.query('DROP TYPE enum_propiedades_tipoOperacion');
  }
};