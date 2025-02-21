
import connectDB from "../../../../lib/connectDb";
import Customer from "../../../../models/Customer"
import Table from "../../../../models/Table"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session?.user?.isSuperAdmin) {
            await await Table.findOneAndUpdate({ patitentID: req.query.deletecustomer }, { patitentID: undefined, isAllocated: false })
            await Customer.findByIdAndDelete(req.query.deletecustomer)
            return res.status(201).json({ message: "Customer Deleted" })
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
