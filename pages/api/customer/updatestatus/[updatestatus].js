
import connectDB from "../../../../lib/connectDb";
import Customer from "../../../../models/Customer"
import Table from "../../../../models/Table"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            req.body.isDone == "Cancel" && await await Table.findOneAndUpdate({ customerID: req.query.updatestatus }, { customerID: undefined, isAllocated: false })
            await Customer.findByIdAndUpdate(req.query.updatestatus, { ...req.body })
            return res.status(201).json({ message: "Status Updated" })
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
