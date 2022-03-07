const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("dotenv").config();

// Conexión DB
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.g3ifu.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

main()
  .then(console.log("Conexión correcta"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`${uri}`);
}

// Importar routes
const authRouter = require("./routes/auth");

// Route middlewares
app.use("/api/user", authRouter);

app.get("/", (req, res) => {
  res.json({
    estado: true,
    mensaje: "funciona!",
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`servidor desplegado en ${PORT}`);
});
