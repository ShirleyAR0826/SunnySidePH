import mongoose from 'mongoose';
    
const serviceAreaSchema = new mongoose.Schema({
    city: {type: String, required: true},
    barangay: {type: String, required: true},
    lalamoveMotorcycleFee: {type: Number, required: true},
    lalamoveMPVFee: {type: Number, required: true},
});

const serviceAreaModel = mongoose.model("ServiceArea", serviceAreaSchema);

export default serviceAreaModel;