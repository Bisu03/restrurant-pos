import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String
    }
})

let Dataset =
    mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Dataset;
