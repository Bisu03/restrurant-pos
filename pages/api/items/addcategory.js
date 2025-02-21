
import connectDB from "../../../lib/connectDb";
import Category from "../../../models/Category"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            await Category.create({ ...req.body })
            return res.status(201).json({ message: "Category Added" })
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
