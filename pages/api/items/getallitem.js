
import connectDB from "../../../lib/connectDb";
import Items from "../../../models/Items"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            let query = {};

            if (req.query.search) {
                query = {
                    item_name: { $regex: req.query.search, $options: "i" }
                };
            }
            const data = await Items.find(query).sort("-createdAt")
            return res.status(201).json(data)
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
