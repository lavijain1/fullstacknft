const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });
const dbURL = process.env.DATABASE;
mongoose
  .connect(dbURL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then((p) => {
    console.log("DB connection success");
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port} ......`);
});
