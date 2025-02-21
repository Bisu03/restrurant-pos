
import connectDB from "../../../lib/connectDb";
import Table from "../../../models/Table"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            const data = await Table.find()
            return res.status(201).json(data)
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
