require("dotenv").config();

const app = require("./app");
const { env } = require("./config/env");

app.listen(env.PORT, () => {
  console.log(`API Casa Clara rodando em http://localhost:${env.PORT}`);
});
