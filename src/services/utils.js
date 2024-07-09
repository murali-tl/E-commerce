
require('dotenv').config({ path: '../.env' });

const validateArgs = (arr) => {
    for(let ele of arr){
        if(typeof(ele) === 'object' && !Array.isArray(ele) && !Object.keys(ele).length){
            return false;
        }
        else if(typeof(ele) === 'object' && !ele.length){
            return false;
        }
        else if(!ele){
            return false;
        }
    }
    return true;
}



module.exports = {
    validateArgs,
}