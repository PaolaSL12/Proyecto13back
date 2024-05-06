const fs = require('fs');
const csv = require('csv-parser');
const Service = require('../../../api/models/Service');
const { default: mongoose } = require('mongoose');

const services = [];

fs.createReadStream('src/utils/Seeds/services/services.csv')
  .pipe(csv())
  .on('data', (data) => services.push(data))
  .on('end', () => {
    fs.writeFile('services.json', JSON.stringify(services, null, 2), (err) => {
      if (err) {
        console.error('Error al escribir el archivo JSON:', err);
        return;
      }
      console.log('Archivo JSON creado exitosamente.');
    });
  });

  const serviceDocuments = services.map(service => new Service(service));

mongoose
.connect('mongodb://localhost:27017/Proyecto13')
.then(async () => {

  await Service.insertMany(serviceDocuments);
})
.catch((err) => console.log(`Error creating data: ${err}`))

.finally(() => mongoose.disconnect());