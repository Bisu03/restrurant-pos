import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    itemID: {
      type: String,
      unique: true,
      required: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    item_cate: {
      type: String,
    },
    item_desc: {
      type: String,
    },
    item_cost: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

let Dataset =
  mongoose.models.Item || mongoose.model("Item", ItemSchema);
export default Dataset;
