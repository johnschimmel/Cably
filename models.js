// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    

    var Driver = new Schema({ 
        firstName : String,
        lastName  : String,
        driverID  : String,
        medallionNum : String,
        ratingNumber : String,  
        date      : { type: Date, default: Date.now },
        comments  : [Comments]
    });

    // add schemas to Mongoose
    mongoose.model('Driver', Driver);
    
};
