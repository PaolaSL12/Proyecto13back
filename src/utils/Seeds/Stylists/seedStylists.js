const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Stylist = require("../../../api/models/Stylist");
require("dotenv").config();

const uri = process.env.DB_URL;

console.log(uri);

mongoose
  .connect(uri)
  .then(async () => {
    console.log("Conexión a MongoDB Atlas exitosa");

    try {
      await Stylist.deleteMany();

      const stylists = [];
      fs.createReadStream("src/utils/Seeds/Stylists/stylists.csv")
        .pipe(csv())
        .on("data", (data) => stylists.push(data))
        .on("end", async () => {
          try {
            const stylistDocuments = [];
            stylists.forEach((stylistData) => {
              const workSchedule = [];
              const daysOff = stylistData.daysOff
                .split(",")
                .map((day) => day.trim());
              const scheduleEntries = stylistData.workSchedule.split(";");
              scheduleEntries.forEach((entry) => {
                const [day, timeRanges] = entry
                  .split(":")
                  .map((item) => item.trim());
                const timeSlots = timeRanges.split("/").map((range) => {
                  const [startTime, endTime] = range
                    .split("-")
                    .map((time) => time.trim().replace(/\./g, ":"));
                  return { startTime, endTime };
                });
                workSchedule.push({ day, timeSlots });
              });

              stylistDocuments.push(
                new Stylist({
                  name: stylistData.name,
                  workSchedule,
                  daysOff,
                  available: true,
                  appointments: []
                })
              );
            });

            await Stylist.insertMany(stylistDocuments);
            console.log("Datos de estilistas insertados exitosamente.");
          } catch (error) {
            console.error("Error al insertar datos de estilistas:", error);
          } finally {
            mongoose.disconnect();
          }
        });
    } catch (error) {
      console.error("Error al eliminar datos existentes de estilistas:", error);
    }
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB Atlas:", err);
  });
