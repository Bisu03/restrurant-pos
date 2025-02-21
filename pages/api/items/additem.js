
import connectDB from "../../../lib/connectDb";
import Items from "../../../models/Items"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            await Items.create(req.body)
            return res.status(201).json({ message: "Item Added" })
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
