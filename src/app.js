const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

const app = express();
const PORT = 3000;

const cors = require('cors')
const myRoute = require('./routes/mainRoutes');

const paymentController = require('./controllers/paymentController.js');
app.post('/webhook', express.raw({type: "application/json"}), paymentController.confirmOrder);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    })
  );
app.use('/', myRoute);

app.get('/', async (req, res) => {
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