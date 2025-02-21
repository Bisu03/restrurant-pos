import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    billingID: {
        type: String,
        required: true,
        unique: true
    },
    bill_no: {
        type: Number,
        required: true
    },
    billing_date: {
        type: String
    },
    billing_time: {
        type: String
    },
    customer_table: {
        type: String
    },
    table_id: {
        type: String
    },
    customer_name: {
        type: String
    },
    customer_contact: {
        type: String
    },
    ordered: {
        type: Array
    },
    amount: {
        type: Object
    },
    isDone: {
        type: String,
        default: "KOT"
    },
    delivery_type: {
        type: String
    },
    payment_mode: {
        type: String
    }

}, {
    timestamps: true
})

let Dataset =
    mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Dataset;