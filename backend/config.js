const path    = require('path');
const thePath = path.join(__dirname, 'uploads');

var development = {
    port		:6117,
    mongoDB 	:'mongodb://admin@localhost:27017/thanksGivingProject',
    jwtSecret	:'liveFreeOrDieHard',
    jwtHeader	:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.', // Do not change this unless you are sure of what you are doing
    uploadPath 	:thePath+'/',
    
    mysql 		: {
        host     : 'localhost',
        user     : 'thanks_user',
        password : 'RSAaZUHbT8ABokwi',
        database : 'thanksgiving'
    }
}
var production = {
    port 		:6117,
    mongoDB 	:'mongodb://admin@localhost:27017/thanksGivingProject',
    jwtSecret 	:'liveFreeOrDieHard',
    jwtHeader 	:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.', // Do not change this unless you are sure of what you are doing
    uploadPath  :thePath+'/',

    mysql 		: {
        host     : 'localhost',
        user     : 'thanks_user',
        password : 'RSAaZUHbT8ABokwi',
        database : 'thanksgiving'
    }
}

const envVars=(process.env.NODE_ENV == 'production'? production: development);
Object.freeze(envVars); // important step to avoid re-declaration of config variables

module.exports = envVars;
