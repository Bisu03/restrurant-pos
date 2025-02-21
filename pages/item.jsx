import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { generateItemtId } from "../utils/generateUniqueId";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen";
import ItemsTable from "../components/ItemsTable";
import { useSession } from "next-auth/react";
import { FaPlus, FaTimes } from "react-icons/fa";

const ItemPage = () => {
    const { data: session } = useSession();
    const [showForm, setShowForm] = useState(false);

    const INITIALSTATE = {
        itemID: generateItemtId(),
        item_name: "",
        item_cate: "",
        item_desc: "",
        item_cost: "",
    };
    const [FormData, setFormData] = useState(INITIALSTATE);

    const HandleChange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value });
    };

    const { isLoading, data: ItemRecord, refetch } = useQuery({
        queryKey: ["ItemRecord"],
        queryFn: () => axios.get(`/api/items/getallitem`).then((res) => res.data),
    });

    const { data: CategoryRecord } = useQuery({
        queryKey: ["CategoryRecord"],
        queryFn: () => axios.get(`/api/items/getcategory`).then((res) => res.data),
    });

    useEffect(() => {
        refetch();
    }, []);

    const HandleSubmit = async () => {
        try {
            const { data } = await axios.post("/api/items/additem", { ...FormData });
            setFormData(INITIALSTATE);
            refetch();
            toast.success(data.message);
            setShowForm(false);
        } catch (error) {
            console.log(error);
            toast.warn(error.response.data.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto mt-20 p-6">
                <h1 className="text-3xl font-bold text-center text-red-600">Manage Menu Items</h1>
                <div className="fixed bottom-2 right-2 justify-center mt-6">
                    <button
                        className="btn btn-secondary flex items-center gap-2 px-6 py-2"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? <FaTimes /> : <FaPlus />} {showForm ? "Close Form" : "Add New Item"}
                    </button>
                </div>
                {showForm && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-10 p-6">
                        <button
                            className="btn btn-secondary flex items-center gap-2 px-6 py-2 mb-2"
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? <FaTimes /> : <FaPlus />}
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                name="item_cate"
                                value={FormData.item_cate}
                                onChange={HandleChange}
                                className="select select-bordered w-full"
                            >
                                <option>Choose Category</option>
                                {CategoryRecord?.map((data, index) => (
                                    <option value={data.category_name} key={index}>{data.category_name}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                name="item_name"
                                value={FormData.item_name}
                                onChange={HandleChange}
                                placeholder="Item Name"
                                className="input input-bordered w-full"
                            />
                            <textarea
                                name="item_desc"
                                value={FormData.item_desc}
                                onChange={HandleChange}
                                placeholder="Description"
                                className="textarea textarea-bordered w-full"
                            />
                            <input
                                type="number"
                                name="item_cost"
                                value={FormData.item_cost}
                                onChange={HandleChange}
                                placeholder="Price"
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="flex justify-center mt-4">
                            <button className="btn btn-primary px-6 py-2" onClick={HandleSubmit}>Submit</button>
                        </div>
                    </div>
                )}
                {isLoading && <LoadingScreen />}
                <div className="mt-8 ">
                    <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                        <table className="table-auto w-full ">
                            <thead>
                                <tr className="bg-red-500 text-white">
                                    <th className="p-2">#</th>
                                    <th className="p-2">Category</th>
                                    <th className="p-2">Name</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2">Price</th>
                                    {session?.user?.isSuperAdmin && <th className="p-2">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {ItemRecord?.map((data, index) => (
                                    <ItemsTable data={data} index={index} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

ItemPage.adminRoute = true;
export default ItemPage;