
import connectDB from "../../../../lib/connectDb";
import Items from "../../../../models/Items"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]";

connectDB()
export default async (req, res) => {
    try {
        const session = await getServerSession(req, res, authOptions)
        if (session?.user?.isSuperAdmin) {
            await Items.findByIdAndDelete(req.query.deleteitems)
            return res.status(201).json({ message: "Items Deleted" })
        } else {
            return res.status(500).json({ message: "unauthorized" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
