const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Conectado con éxito");
    } catch (error) {
        console.log("Error en la conexión");
    }
}

module.exports = { connectDB }