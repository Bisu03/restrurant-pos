
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
            if (req?.body?.customer_table_sift) {
                await Table.findByIdAndUpdate(req.body.table_id, { patitentID: "", isAllocated: false })
                const Tableid = await Table.findById(req.body.customer_table_sift)
                const data = await Customer.findByIdAndUpdate(req.query.updatecustomerbyid, { ...req.body, table_id: req?.body?.customer_table_sift, customer_table: Tableid.table_name })
                await Table.findByIdAndUpdate(req.body.customer_table_sift, { patitentID: data._id, isAllocated: true })
                return res.status(201).json({ message: "Customer Update" })
            } else {
               
                await Customer.findByIdAndUpdate(req.query.updatecustomerbyid, { ...req.body })
                return res.status(201).json({ message: "Customer Update" })
            }
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
