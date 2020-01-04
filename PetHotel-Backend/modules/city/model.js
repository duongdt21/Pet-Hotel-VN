const mongoose = require('mongoose');

// name, user , address {city, district, ward, detail_address} location_map {lat , lng}
// service {hair trimming, spa bath, take care} pet_Type: {dog, cat} productivity openTime closeTime highestPrice lowestPrice image []
// system_active


const CitySchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        district: {
            type: [String],
            required: true,
        }
});

const CityModel = mongoose.model('City',CitySchema);
module.exports = CityModel;