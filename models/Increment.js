import mongoose from "mongoose";

const incrementSchema = new mongoose.Schema({
    id: {
        type: String,
        default: "autoincrement"
    },
    seq: {
        type: Number
    }
})
let Dataset =
    mongoose.models.Autoincrement || mongoose.model("Autoincrement", incrementSchema);
export default Dataset;