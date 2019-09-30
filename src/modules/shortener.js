var shortid     = require('shortid');
var crypto      = require("crypto");

module.exports = {
        /**
         * Generate shortHash...
         * 
         * @param {prefix} prefix 
         * @param {isShortIdRequired} isShortIdRequired 
         * @param {length} length 
         * @param {isTimeRequired} isTimeRequired 
         */
    createShortHash (prefix = '', isShortIdRequired = false, length = 4, isTimeRequired = false) {
            var shid = prefix;
            if (isShortIdRequired === true) {
                shid += shortid.generate();
            }
    
            shid += crypto.randomBytes(length).toString('hex');
    
            if (isTimeRequired === true ) {
                shid += new Date().getTime() + "";
            }
    
            return shid;
        }
}
