const fs = require('fs');
const csv = require('csv-parser');
const Service = require('../../../api/models/Service');
const mongoose = require('mongoose');
require("dotenv").config();

const uri = process.env.DB_URL;

console.log(uri);

mongoose.connect(uri)
.then(async () => {
  console.log('Conexión a MongoDB Atlas exitosa');

  const services = [];
  fs.createReadStream('src/utils/Seeds/services/services.csv')
    .pipe(csv())
    .on('data', (data) => services.push(data))
    .on('end', async () => {
      try {
        const serviceDocuments = services.map(service => new Service(service));

        await Service.insertMany(serviceDocuments);
        console.log('Datos insertados exitosamente.');
      } catch (error) {
        console.error('Error al insertar datos:', error);
      } finally {
        mongoose.disconnect();
      }
    });
})
.catch((err) => {
  console.error('Error al conectar a MongoDB Atlas:', err);
});