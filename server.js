const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("Develop/public"));

// mongoose.connect("mongodb://localhost/Ledger", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/ledger',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
// routes
app.use(require("./Develop/routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});