const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/yunnited-crew', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Erro ao conectar ao MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
