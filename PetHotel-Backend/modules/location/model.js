const mongoose = require('mongoose');

// name, user , address {city, district,detail_address} location_map {lat , lng}
// service {hair trimming, spa bath, take care} pet_Type: {dog, cat} productivity openTime closeTime highestPrice lowestPrice image []
// system_active


const LocationSchema = new mongoose.Schema({
    nameLocation: {
        type: String,
        required: true,
    },
    address: {
        city: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        detailAddress: {
            type: String,
            required: true,
        }
    },
    locationMap: {
        lat: {
            type: String,
            required: false
        },
        lng: {
            type: String,
            required: false,
        }
    },
    // service {hair trimming, spa bath, take care} pet_Type: {dog, cat} productivity openTime closeTime highestPrice lowestPrice image []

    service: {
        hairTrimming: {
            type: Boolean,
            default: false
        },
        spaBath: {
            type: Boolean,
            default: false
        },
        takeCare: {
            type: Boolean,
            default: false
        }
    },
    petType: {
        dog: {
            type: Boolean,

            default: false
        },
        cat: {
            type: Boolean,
            default: false
        }
    },
    productivity: {
        type: Number,
        required: true,
        min: 1, 
    },
    openTime: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    closeTime: {
        type: Number,
        required: true,
        min: 1,
        max: 24
    },
    highestPrice: {
        type: String,
        required: false
    },
    lowestPrice: {
        type: String,
        required: false
    },
    imageUrl: {
        type: [String],
        required: true 
    },
    systemActive: {
        type: Boolean,
        required: true,
        default: false,
    },
    userManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
}
);

const LocationModel = mongoose.model('Location',LocationSchema);
module.exports = LocationModel;