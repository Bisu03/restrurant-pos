
import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            const list = await Customer.find({
                billing_date: {
                    $gte: req.query.fromdate,
                    $lte: req.query.todate,
                }, isDone: "Done"
            }).sort("-createdAt")
            return res.status(201).json(list);
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}