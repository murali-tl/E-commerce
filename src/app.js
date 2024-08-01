const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors')

const paymentController = require('./controllers/paymentController.js');
app.post('/webhook', express.raw({type: "application/json"}), paymentController.confirmOrder);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
const myRoute = require('./routes/routes.js');

app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
app.use('/api', myRoute);

app.get('/health', async (req, res) => {
    console.info("/health api called at", new Date().toISOString());
    res.status(200).send("Welcome to health URL of Server");
});

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
    else
        console.log("Error occurred, server can't start", error);
}
);