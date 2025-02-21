import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    table_name: {
        type: String
    },
    customerID: {
        type: String
    },
    isAllocated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

let Dataset =
    mongoose.models.Table || mongoose.model("Table", tableSchema);
export default Dataset;