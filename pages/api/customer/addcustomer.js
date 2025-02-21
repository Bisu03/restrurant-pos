
import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer"
import Increment from "../../../models/Increment"
import Table from "../../../models/Table"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session) {
            let seqdata
            seqdata = await Increment.findOneAndUpdate(
                {
                    id: "autoincrement",
                },
                {
                    $inc: { seq: 1 },
                }
            );

            if (seqdata == null) {
                seqdata = await Increment.create(
                    {
                        id: "autoincrement",
                        seq: 1
                    }
                );
            }
            if (seqdata != null) {
                console.log(req.body.table_id);
                req.body.table_id ? await Table.findByIdAndUpdate(req.body.table_id, { isAllocated: false }) : undefined
                const data = await Customer.create({ ...req.body, bill_no: seqdata.seq });
                await Table.findByIdAndUpdate(req.body.table_id, { customerID: data._id, isAllocated: true })
                return res.status(201).json(data._id);
            }
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
