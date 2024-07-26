# Ecommerce
using Express, Postgres and Sequelize

Install node_modules from the root of the project directory
```bash
$ npm i
```

## Database Migration

To ensure your database migrations are upto date, run:
```
$ npx sequelize-cli db:migrate
```

## Seeding the databse

To store/set default values to your database
```
$ npx sequelize-cli db:seed:all
```

## Run Project
To run this project you need to switch to src/ directory and run node app.js

 ```bash
 $ cd src
 ```

Now setup Environment variables as follows:

.env
```js
NODE_ENV =       //development or test or production
ACCESS_TOKEN_SECRET = 
REFRESH_TOKEN_SECRET = 
EMAIL_USER_NAME = 
EMAIL_PASSWORD = 
DB_USER =  
DB_PASSWORD= 
DB_NAME = 
DB_HOST = 
DB_DRIVER = 
STRIPE_SECRET_API_KEY = 
```

Now run the app.js file using "node" command
```
$ node app.js
```