import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { generateUniqueId } from "../../utils/generateUniqueId";
import LoadingScreen from "../../components/LoadingScreen";
import { FaBox, FaChair, FaCheckCircle, FaGlassCheers, FaMapMarkerAlt, FaMinusCircle, FaMobileAlt, FaMoneyBillWave, FaMotorcycle, FaPercentage, FaPhone, FaPlusCircle, FaReceipt, FaRegClipboard, FaRupeeSign, FaSearch, FaShippingFast, FaSignature, FaTag, FaTimes, FaTruck, FaUser, FaUtensils } from "react-icons/fa";
import { MdDelete, MdFastfood } from "react-icons/md";
import { IoFastFoodSharp } from "react-icons/io5";

const updatecustomer = () => {
    const router = useRouter();
    const { updatecustomer, tableid } = router.query;

    const [SubmitLoading, setSubmitLoading] = useState(false);
    const [FormData, setFormData] = useState({ ordered: [] }); // Initialize ordered as an empty array
    const [SiftTable, setSiftTable] = useState();
    const [selectedItem, setSelectedItem] = useState({
        itemid: generateUniqueId(),
        itemcate: "",
        itemname: "",
        itemprice: "",
        quantity: "",
    });

    const [ShowCustomer, setShowCustomer] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [openIndex, setOpenIndex] = useState("All");
    const accordionRef = useRef(null);
    const [SelectItem, setSelectItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [TotalCharges, setTotalCharges] = useState({ totalcharge: 0, discount: 0, gst: 0, paybalamount: 0 });
    const [Loading, setLoading] = useState(false);

    const HandleChange = (e) => {
        setFormData({ ...FormData, [e.target.name]: e.target.value });
    };

    console.log(FormData);

    const { data: TableRecords } = useQuery({
        queryKey: ["TableRecords"],
        queryFn: () =>
            axios.get(`/api/tables/gettables`).then((res) => res.data),
    });

    const FetchBillingData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/customer/getbyid/` + updatecustomer);
            setFormData(data);
            setTotalCharges({
                totalcharge: data?.amount?.totalcharge || 0,
                discount: data?.amount?.discount || 0,
                gst: data?.amount?.gst || 0,
                paybalamount: data?.amount?.paybalamount || 0,
            });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const { isLoading, error, data: ItemRecord, refetch } = useQuery({
        queryKey: ["ItemRecords"],
        queryFn: () =>
            axios.get(`/api/items/getallitem?search=${searchQuery}`).then((res) => res.data),
    });

    useEffect(() => {
        refetch();
    }, [searchQuery]);

    useEffect(() => {
        FetchBillingData();
    }, [updatecustomer]);


    const calculateTotalCharges = () => {
        // Calculate subtotal from ordered items
        const subtotal = FormData.ordered.reduce((acc, item) => {
            return acc + (Number(item.item_cost) * Number(item.qty) || 0);
        }, 0);

        // Get current charges values
        const discount = Number(TotalCharges.discount) || 0;
        const gstPercentage = Number(TotalCharges.gst) || 0;

        // Calculate GST first
        const gstAmount = subtotal * (gstPercentage / 100);
        const totalWithGST = subtotal + gstAmount;

        // Apply discount to GST-inclusive total
        const netPayable = Math.max(totalWithGST - discount, 0); // Ensure non-negative

        setTotalCharges(prev => ({
            ...prev,
            totalcharge: subtotal,
            paybalamount: netPayable.toFixed(2), // Format to 2 decimal places
            gst: gstPercentage,
            discount: discount
        }));
    };

    // UseEffect to recalculate when any relevant value changes
    useEffect(() => {
        calculateTotalCharges();
    }, [FormData.ordered, TotalCharges.discount, TotalCharges.gst]);

    const handleChangeTotal = (e) => {
        const { name, value } = e.target;
        const numericValue = Math.max(Number(value) || 0, 0);

        setTotalCharges(prev => ({
            ...prev,
            [name]: numericValue
        }));
    };
    const removeItemTest = (itemID, itemId, qty) => {
        const updatedOrdered = FormData.ordered.filter(item => item.itemid !== itemId);
        setFormData({
            ...FormData,
            ordered: updatedOrdered,
        });
        calculateTotalCharges(); // Recalculate totals after removing
    };

    const HandleSubmit = async () => {
        setSubmitLoading(true);
        try {
            await axios.put(`/api/customer/updatecustomerbyid/` + updatecustomer, {
                ...FormData,
                customer_table_sift: SiftTable,
                amount: TotalCharges,
            });
            setSubmitLoading(false);
            tableid ? router.push("/tablestatus") : router.push("/records");
        } catch (error) {
            setSubmitLoading(false);
            console.log(error);
            toast.warn("Something went wrong");
        }
    };

    const { data: CategoryRecord } = useQuery({
        queryKey: ["CategoryRecord"],
        queryFn: () => axios.get(`/api/items/getcategory`).then(res => res.data),
    });


    const DecreaseQuantity = (itemID, itemId) => {
        const updatedOrderedItems = [...FormData.ordered];
        const index = updatedOrderedItems.findIndex(item => item.itemid === itemId);
        if (index !== -1) {
            if (updatedOrderedItems[index].qty > 1) {
                // Decrease quantity by 1
                updatedOrderedItems[index].qty -= 1;
                setFormData({ ...FormData, ordered: updatedOrderedItems });
            } else {
                // Remove item if quantity becomes less than or equal to 0
                removeItemTest(itemID, itemId, updatedOrderedItems[index].qty);
            }
            calculateTotalCharges(); // Recalculate totals after updating quantity
        }
    };

    const handleItemClick = (itemName, itemid) => {
        setSelectItem(itemName);
        setSearchQuery("");
        const existingItemIndex = FormData.ordered.findIndex(item => item.itemid === itemid);

        if (existingItemIndex !== -1) {
            // Item already exists, increment quantity by 1
            const updatedOrderedItems = [...FormData.ordered];
            updatedOrderedItems[existingItemIndex].qty += 1;
            setFormData({ ...FormData, ordered: updatedOrderedItems });
        } else {
            // Item does not exist, prompt for quantity input
            const input = 1;
            if (input !== null) {
                const qty = parseInt(input);
                if (!isNaN(qty) && qty > 0) {
                    const foundObject = ItemRecord.find(obj => obj.itemID === itemid);
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        ordered: [...prevFormData.ordered, { ...foundObject, qty, itemid }],
                    }));
                } else {
                    alert('Please enter a valid quantity!');
                }
            }
        }
        calculateTotalCharges(); // Recalculate totals after adding item
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                if (SelectItem && quantity > 0) {
                    alert(`You have selected ${quantity} ${SelectItem}`);
                }
                setSelectItem(null);
                setQuantity(1);
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [SelectItem, quantity]);


    return (
        <div>
            <Navbar />

            {Loading && <LoadingScreen />}

            <div className="px-5 mb-10 mt-24">
                {ShowCustomer && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border-2 border-orange-100">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-t-2xl flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white">
                                    <FaUtensils className="w-6 h-6" />
                                    <h2 className="text-lg md:text-xl font-bold">Customer Details</h2>
                                </div>
                                <button
                                    className="btn btn-circle btn-sm btn-ghost hover:bg-white/20"
                                    onClick={() => setShowCustomer(false)}
                                >
                                    <FaTimes className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Form Content */}
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Customer Name */}
                                <div className="form-control">
                                    <label className="label text-sm md:text-base">
                                        <FaUser className="text-orange-500" /> Customer Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="customer_name"
                                            value={FormData.customer_name}
                                            onChange={HandleChange}
                                            placeholder="Enter name"
                                            className="input input-bordered w-full pl-10 bg-orange-50 border-orange-200 focus:border-orange-400"
                                        />
                                        <FaSignature className="absolute left-3 top-3 text-orange-400" />
                                    </div>
                                </div>

                                {/* Contact Number */}
                                <div className="form-control">
                                    <label className="label text-sm md:text-base">
                                        <FaPhone className="text-orange-500" /> Contact Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="customer_contact"
                                            value={FormData.customer_contact}
                                            onChange={HandleChange}
                                            placeholder="Enter number"
                                            className="input input-bordered w-full pl-10 bg-orange-50 border-orange-200 focus:border-orange-400"
                                        />
                                        <FaMobileAlt className="absolute left-3 top-3 text-orange-400" />
                                    </div>
                                </div>

                                {/* Table Selection */}
                                <div className="form-control">
                                    <label className="label text-sm md:text-base">
                                        <FaChair className="text-orange-500" /> Table Selection
                                    </label>
                                    <select
                                        name="customer_table"
                                        value={FormData.customer_table}
                                        onChange={HandleChange}
                                        className="select select-bordered w-full bg-orange-50 border-orange-200 focus:border-orange-400"
                                    >
                                        <option value="" className="text-gray-400">Select table</option>
                                        <option value="PARCEL" className="text-orange-600">🚚 PARCEL</option>
                                        {TableRecords?.map((data) => (
                                            <option value={data.table_name} key={data.id}>🪑 {data.table_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Table Sift */}
                                <div className="form-control">
                                    <label className="label text-sm md:text-base">
                                        <FaChair className="text-orange-500" /> Table Sift
                                    </label>
                                    <select
                                        name="SiftTable"
                                        value={SiftTable}
                                        onChange={(e) => setSiftTable(e.target.value)}
                                        className="select select-bordered w-full bg-orange-50 border-orange-200 focus:border-orange-400"
                                    >
                                        <option value="" className="text-gray-400">Select table</option>
                                        <option value="PARCEL" className="text-orange-600">🚚 PARCEL</option>
                                        {TableRecords?.map((data) => (
                                            <option value={data._id} key={data.id}>🪑 {data.table_name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Service Type */}
                                <div className="form-control md:col-span-2">
                                    <label className="label text-sm md:text-base">
                                        <FaShippingFast className="text-orange-500" /> Service Type
                                    </label>
                                    <select
                                        name="delivery_type"
                                        value={FormData.delivery_type}
                                        onChange={HandleChange}
                                        className="select select-bordered w-full bg-orange-50 border-orange-200 focus:border-orange-400"
                                    >
                                        <option value="">Select service type</option>
                                        <option value="Dine In">🍽️ Dine In</option>
                                        <option value="Take Away">📦 Take Away</option>
                                        <option value="Delivery">🏍️ Delivery</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="p-4">
                                <button onClick={() => setShowCustomer(false)} className="btn w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600">
                                    {Loading ? (
                                        <span className="loading loading-spinner"></span>
                                    ) : (
                                        <>
                                            <FaCheckCircle className="mr-2" /> Confirm Details
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}



                <div className="flex justify-between gap-4 w-full p-4 bg-gradient-to-br from-orange-50 to-amber-50  overflow-hidden">
                    {/* Food Menu Section */}
                    <div className="flex-1 bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden flex flex-col h-[100vh]">
                        {/* Menu Header */}
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-white">
                                <IoFastFoodSharp className="w-8 h-8" />
                                <h1 className="text-lg font-bold font-cursive">Delicious Menu</h1>
                                <IoFastFoodSharp className="w-8 h-8" />
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:max-w-md">
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search dishes..."
                                    className="input input-bordered w-full pl-10 bg-white/90"
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />

                                {/* Search Results Dropdown */}
                                {searchQuery && (
                                    <div className="absolute top-12 w-full bg-white rounded-lg shadow-xl z-50 max-h-40 overflow-y-auto">
                                        {ItemRecord?.map((data) => (
                                            <div
                                                key={data.itemID}
                                                className="p-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center border-b"
                                                onClick={() => handleItemClick(data.item_name, data.itemID)}
                                            >
                                                <span className="font-medium">{data.item_name}</span>
                                                <span className="text-amber-700">₹{data.item_cost}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Category Tabs */}
                        <div className="p-4 border-b border-orange-100">
                            <div className="flex gap-2 overflow-x-auto pb-2 scroll-smooth">
                                <button
                                    className={`btn ${openIndex === "All" ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-800'} 
            rounded-full gap-2 min-w-[120px] hover:scale-105 transition-transform`}
                                    onClick={() => setOpenIndex("All")}
                                >
                                    <MdFastfood />
                                    All
                                </button>

                                {CategoryRecord?.map((category) => (
                                    <button
                                        key={category._id}
                                        className={`btn ${category.category_name === openIndex ? 'bg-red-500 text-white' : 'bg-orange-100 text-orange-800'} 
              rounded-full gap-2 min-w-[120px] hover:scale-105 transition-transform`}
                                        onClick={() => setOpenIndex(category.category_name)}
                                    >
                                        <MdFastfood />
                                        {category.category_name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Menu Items Grid (Scrollable) */}
                        <div className="flex-1 overflow-y-auto max-h-[60vh] p-4">
                            {isLoading ? (
                                <div className="p-8 flex justify-center">
                                    <div className="loading loading-spinner loading-lg text-red-500"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ItemRecord?.map((item) => (
                                        (openIndex === "All" || item?.item_cate === openIndex) && (
                                            <div
                                                key={item._id}
                                                className="bg-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow 
                 border border-orange-100 cursor-pointer group"
                                                onClick={() => handleItemClick(item.item_name, item.itemID)}
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="bg-red-100 p-2 rounded-lg">
                                                        <MdFastfood className="w-6 h-6 text-red-500" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600">
                                                        {item.item_name}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="badge badge-outline badge-lg border-red-200 text-red-600">
                                                        {item.item_cate}
                                                    </div>
                                                    <span className="text-xl font-bold text-amber-700 flex items-center">
                                                        <FaRupeeSign className="mr-1" />{item.item_cost}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className=" bg-white rounded-2xl shadow-lg border border-orange-100 h-[80vh] flex flex-col w-fit">
                        <div className="p-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl">
                            <div className="flex items-center gap-2 text-white">
                                <FaReceipt className="w-6 h-6" />
                                <h2 className="text-xl font-bold">Current Order</h2>
                            </div>
                        </div>

                        {/* Order List (Scrollable) */}
                        <div className="p-4 overflow-y-scroll ">
                            {FormData?.ordered?.length > 0 ? (
                                <div >
                                    {FormData.ordered.map((data, index) => (
                                        <div key={data.itemID} className="border-b border-orange-100 ">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-gray-800 w-28">{index + 1}. {data.item_name}</h3>
                                                    <p className="text-amber-700 font-medium">₹{data.item_cost}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => DecreaseQuantity(data.item_name, data.itemID)}
                                                        className="btn btn-circle btn-sm btn-ghost text-red-500 hover:bg-red-100"
                                                    >
                                                        <FaMinusCircle className="w-5 h-5" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{data.qty}</span>
                                                    <button
                                                        onClick={() => handleItemClick(data.item_name, data.itemID)}
                                                        className="btn btn-circle btn-sm btn-ghost text-green-500 hover:bg-green-100"
                                                    >
                                                        <FaPlusCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => removeItemTest(data.itemID, data.itemid, data.qty)}
                                                    className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100 gap-1"
                                                >
                                                    <MdDelete className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 text-gray-400">
                                    <FaRegClipboard className="w-12 h-12 mx-auto mb-4" />
                                    <p>Your order is empty. <br /> Start adding delicious items!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex w-full justify-end px-2 py-2 bg-orange-50 rounded-xl shadow-lg">
                    <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 w-full justify-center md:justify-end">
                        {/* Total Amount */}
                        <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-sm w-[100px] md:w-[120px]">
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                                <FaMoneyBillWave className="text-amber-600 w-4 h-4" />
                                <span className="font-semibold">Total</span>
                            </div>
                            <input
                                type="tel"
                                name="totalcharge"
                                value={TotalCharges?.totalcharge}
                                readOnly
                                className="text-lg font-bold text-amber-700 bg-transparent border-none w-full text-center"
                            />
                        </div>

                        {/* Discount */}
                        <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-sm w-[100px] md:w-[120px]">
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                                <FaTag className="text-green-600 w-4 h-4" />
                                <span className="font-semibold">Discount</span>
                            </div>
                            <input
                                type="number"
                                name="discount"
                                value={TotalCharges.discount}
                                onChange={handleChangeTotal}
                                placeholder="₹"
                                className="text-green-700 bg-transparent border-none w-full text-center"
                            />
                        </div>

                        {/* GST */}
                        <div className="bg-white p-2 rounded-lg border border-amber-200 shadow-sm w-[100px] md:w-[120px]">
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                                <FaPercentage className="text-blue-600 w-4 h-4" />
                                <span className="font-semibold">GST</span>
                            </div>
                            <input
                                type="number"
                                name="gst"
                                value={TotalCharges.gst}
                                onChange={handleChangeTotal}
                                placeholder="%"
                                className="text-blue-700 bg-transparent border-none w-full text-center"
                            />
                        </div>

                        {/* Payable */}
                        <div className="bg-amber-100 p-2 rounded-lg border border-amber-300 shadow-sm w-[100px] md:w-[120px]">
                            <div className="flex items-center gap-1 text-gray-600 text-xs">
                                <FaReceipt className="text-red-600 w-4 h-4" />
                                <span className="font-semibold">Payable</span>
                            </div>
                            <input
                                type="text"
                                name="paybalamount"
                                value={TotalCharges?.paybalamount}
                                className="text-lg font-bold text-red-700 bg-transparent border-none w-full text-center"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                className="btn bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl flex items-center text-sm"
                                onClick={HandleSubmit}
                            >
                                {Loading ? <span className="loading loading-spinner"></span> : <FaUtensils className="w-4 h-4 mr-1" />}
                                Confirm
                            </button>
                            <button
                                className="btn bg-gradient-to-r from-blue-500 to-slate-500 text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl flex items-center text-sm"
                                onClick={() => setShowCustomer(true)}
                            >
                                {Loading ? <span className="loading loading-spinner"></span> : <FaUser className="w-4 h-4 mr-1" />}
                                Customer
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div >
    );
};

updatecustomer.adminRoute = true;
export default updatecustomer;
