import connectDB from "../../../lib/connectDb";
import Customer from "../../../models/Customer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

connectDB();

export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (session) {
            const { page = 1, pageSize = 10 } = req.query;
            let query = {};

            if (req.query.search) {
                query = {
                    billingID: { $regex: req.query.search, $options: "i" }
                };
            } else if (req.query.fromdate && req.query.todate) {
                query = {
                    billing_date: {
                        $gte: req.query.fromdate,
                        $lte: req.query.todate
                    }
                };
            }

            const totalRecords = await Customer.countDocuments(query);
            const totalPages = Math.ceil(totalRecords / pageSize);

            const list = await Customer.find(query)
                .sort("-createdAt")
                .skip((page - 1) * pageSize)
                .limit(parseInt(pageSize));

            return res.status(201).json({
                list,
                totalPages
            });
        } else {
            return res.status(500).json({ message: "Unauthorized" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
