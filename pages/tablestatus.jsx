import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineRestaurant, MdTableRestaurant } from 'react-icons/md';
import { FaUtensils, FaConciergeBell, FaCashRegister, FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LoadingScreen from '../components/LoadingScreen';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useRouter } from 'next/router';

const TableStatus = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const { data: session } = useSession();
    const [tableName, setTableName] = useState("");
    const [FormData, setFormData] = useState("");
    const [TableInfo, setTableInfo] = useState({ tableId: "", patientId: "" });
    const [billingData, setBillingData] = useState([]);
    const [AddTable, showAddTable] = useState(false);

    const { isLoading, data: tableRecords, refetch } = useQuery({
        queryKey: ["TableRecords"],
        queryFn: async () => {
            const res = await axios.get('/api/tables/gettables');
            return res.data;
        },
    });

    useEffect(() => {
        refetch();
    }, []);

    const handleSubmit = async () => {
        try {
            await axios.post("/api/tables/addtable", { table_name: tableName });
            setTableName("");
            refetch();
        } catch (error) {
            console.error(error);
        }
        showAddTable(false)
    };

    const handleShowBlock = async (tableId, billingID) => {
        setShow(true);
        try {
            const { data } = await axios.get(`/api/customer/getbyid/${billingID}`);
            setBillingData(data);

        } catch (error) {
            console.error(error);
        }
        setTableInfo({ tableid: tableId, customerID: billingID });
    };

    const BillingUpdateCancel = async () => {
        try {
            await axios.put(
                "/api/customer/updatestatus/" + TableInfo?.customerID,
                { isDone: "Cancel" }
            );
            handleShowBlock()
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong! check your internet");
        }
    };

    const BillingUpdateDone = async () => {
        try {
            await axios.put(
                "/api/customer/updatestatus/" + TableInfo?.customerID,
                { isDone: "Done" }
            );
            router.push(`/bill/${billingData?._id}`)
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong");
        }
    };



    const updateBillingStatus = async (status) => {
        try {
            await axios.put(`/api/customer/updatestatus/${TableInfo.billingID}`, { isDone: status });
            status === "Done" ? router.push(`/bill/${billingData?._id}`) : location.reload();
        } catch (error) {
            console.error(error);
            toast.warn("Something went wrong! Check your internet");
        }
    };

    const HandleUpdatePayment = async () => {
        if (!FormData) {
            return toast.warn("Select the payment method")
        }
        try {
            await axios.put(
                "/api/customer/updatepayment/" + TableInfo?.customerID,
                { ...TableInfo, payment_mode: FormData }
            );
            router.push(`/bill/${billingData?._id}`)
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong! check your internet");
        }
    };



    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="mt-16"></div>
            {session?.user?.isSuperAdmin && (


                <div className="fixed bottom-6 right-2" onClick={() => showAddTable(true)}>
                    <FaPlusCircle className='h-10 w-10 text-red-600 ' />
                </div>
            )}


            {
                AddTable && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                            <AiFillCloseCircle className="text-red-600 text-3xl cursor-pointer mb-4" onClick={() => showAddTable(false)} />
                            <h3 className="text-xl font-bold mb-4">Add Table</h3>
                            <input
                                type="text"
                                value={tableName}
                                onChange={(e) => setTableName(e.target.value)}
                                placeholder="Enter table name"
                                className="input input-bordered w-full max-w-xs"
                            />
                            <button className="btn btn-warning mt-4" onClick={handleSubmit}>Add</button>
                        </div>
                    </div>
                )
            }
            <h2 className="text-center text-2xl font-bold text-red-600 py-4">🍽️ Table Status</h2>
            {isLoading && <LoadingScreen />}
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {tableRecords?.map((table, index) => (
                    table?.isAllocated ? (
                        <button key={index} className="flex flex-col items-center p-4 bg-red-500 text-white rounded-lg shadow-lg" onClick={() => handleShowBlock(table._id, table.customerID)}>
                            <FaUtensils className='h-10 w-10' />
                            <p className='text-lg font-bold'>{table.table_name}</p>
                        </button>
                    ) : (
                        <Link key={index} href={`/addcustomer?tableid=${table._id}&tablename=${table.table_name}`} className="flex flex-col items-center p-4 bg-green-500 text-white rounded-lg shadow-lg">
                            <MdTableRestaurant className='h-10 w-10' />
                            <p className='text-lg font-bold'>{table.table_name}</p>
                        </Link>
                    )
                ))}
            </div>
            {show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                        <AiFillCloseCircle className="text-red-600 text-3xl cursor-pointer mb-4" onClick={() => { setBillingData([]); setShow(false) }} />
                        <h3 className="text-xl font-bold mb-4">Bill Details</h3>
                        <table className="w-full border rounded-lg">
                            <thead>
                                <tr className="bg-gray-300">
                                    <th>Billing ID</th>
                                    <th>Customer</th>
                                    <th>Table</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{billingData?.billingID}</td>
                                    <td>{billingData?.customer_name}</td>
                                    <td>{billingData?.customer_table}</td>
                                    <td>{billingData?.isDone}</td>
                                    <td>{billingData?.amount?.paybalamount}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-center gap-4 mt-4">
                            {billingData?.isDone === "KOT" ? (
                                <>
                                    <Link className='bg-blue-500 text-white py-2 px-4 rounded' href={`/updatecustomer/${billingData?._id}?tableid=${billingData.table_id}&tablename=${billingData.customer_table}`}>Update</Link>
                                    <button className='bg-green-500 text-white py-2 px-4 rounded' onClick={BillingUpdateDone}>Mark As Done</button>
                                    <button className='bg-red-500 text-white py-2 px-4 rounded' onClick={BillingUpdateCancel}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <select value={FormData}
                                        onChange={(e) => setFormData(e.target.value)}
                                        className="p-2 border rounded">
                                        <option value="">Select Payment</option>
                                        <option value="Cash">💵 Cash</option>
                                        <option value="Online">📲 Online</option>
                                        <option value="Card">💳 Card</option>
                                    </select>
                                    <button className='bg-green-500 text-white py-2 px-4 rounded' onClick={HandleUpdatePayment}>Update Payment</button>
                                    <Link className='bg-blue-500 text-white py-2 px-4 rounded' href={`/bill/${billingData?._id}`}>Print</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

TableStatus.adminRoute = true;
export default TableStatus;






// const tablestatus = () => {
//     const router = useRouter()
//     const [Show, setShow] = useState(false);
//     const { data: session } = useSession()
//     const [Table, setTable] = useState("")
//     const [FormData, setFormData] = useState("");
//     const [TableInfo, setTableInfo] = useState({
//         tableid: "",
//         patitentId: ""
//     })
//     const [BillingData, setBillingData] = useState([]);

//     const {
//         isLoading,
//         error,
//         data: TableRecords,
//         refetch,
//     } = useQuery({
//         queryKey: ["TableRecords"],
//         queryFn: () =>
//             axios
//                 .get(
//                     /api/tables/gettables
//                 )
//                 .then((res) => {
//                     return res.data;
//                 }),
//     });

//     useEffect(() => {
//         refetch()
//     }, [])


//     const HandleSubmit = async (e) => {
//         try {
//             const { data } = await axios.post("/api/tables/addtable", { table_name: Table })
//             setTable("")
//             refetch()
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     const HandleShowBlock = async (tid, pid) => {
//         setShow(true)
//         try {
//             const { data } = await axios.get(/api/customer/getbyid/ + pid);
//             setBillingData(data);
//         } catch (error) {
//             console.log(error);
//         }
//         setTableInfo({
//             tableid: tid,
//             patitentId: pid
//         })
//     }



//     const BillingUpdateCancel = async () => {
//         try {
//             await axios.put(
//                 "/api/customer/updatestatus/" + TableInfo?.patitentId,
//                 { isDone: "Cancel" }
//             );
//             location.reload();
//         } catch (error) {
//             console.log(error);
//             toast.warn("something went wrong! check your internet");
//         }
//     };
//     const BillingUpdateDone = async () => {
//         try {
//             await axios.put(
//                 "/api/customer/updatestatus/" + TableInfo?.patitentId,
//                 { isDone: "Done" }
//             );
//             router.push(/bill/${BillingData?._id})
//         } catch (error) {
//             console.log(error);
//             toast.warn("something went wrong");
//         }
//     };

//     const HandleUpdatePayment = async () => {
//         if (!FormData) {
//             return toast.warn("Select the payment method")
//         }
//         try {
//             await axios.put(
//                 "/api/customer/updatepayment/" + TableInfo?.patitentId,
//                 { payment_mode: FormData, ...TableInfo }
//             );
//             router.push(/bill/${BillingData?._id})
//         } catch (error) {
//             console.log(error);
//             toast.warn("something went wrong! check your internet");
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="mt-16"></div>
//             {session?.user?.isSuperAdmin && <div className="flex w-full justify-center space-x-2 ">
//                 <input
//                     type="text"
//                     value={Table}
//                     onChange={(e) => setTable(e.target.value)}
//                     placeholder="Type here"
//                     className="input input-bordered w-full max-w-xs"
//                 />
//                 <button className='btn btn-wide btn-warning' onClick={HandleSubmit} >Add</button>
//             </div>}

//             <p className="font-bold text-center my-4 bg-secondary py-4 text-xl">TABLE STATUS</p>

//             {isLoading && <LoadingScreen />}

//             <div className="p-2">
//                 <div className="border border-red-300 rounded-xl  p-2 flex flex-wrap justify-start w-full">
//                     {TableRecords?.map((data, index) => (

//                         data?.isAllocated ? < button key={index} className={flex flex-col justify-center p-4 rounded-xl w-36 h-28 m-3 ${data.isAllocated ? "bg-red-300" : "bg-green-300"} } onClick={() => HandleShowBlock(data._id, data.patitentID)} >
//                             <div className="flex w-full justify-center p-2">
//                                 <MdTableRestaurant className='h-10 w-10' />
//                             </div>
//                             <p className='text-center font-bold w-full'>{data.table_name}</p>
//                         </button> :
//                             < Link key={index} href={/addcustomer?tableid=${data._id}&tablename=${data.table_name}} className={flex flex-col rounded-xl justify-center p-2  border m-4 w-36 h-28  ${data.isAllocated ? "bg-red-300" : "bg-green-300"} }>
//                                 <div className="flex w-full justify-center p-2">
//                                     <MdTableRestaurant className='h-10 w-10' />
//                                 </div>
//                                 <p className='text-center font-bold'>{data.table_name}</p>
//                             </Link>

//                     ))}

//                 </div>
//             </div>

//             {Show && (
//                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-300 z-10">
//                     <AiFillCloseCircle
//                         className="m-2 h-8 w-8"
//                         onClick={() => {
//                             setShow(!Show)
//                             setBillingData([])
//                         }}
//                     />
//                     <div className="flex flex-wrap w-full justify-between  p-8 ">
//                         <div className="overflow-x-auto h-auto ">
//                             <table className="table">
//                                 {/* head */}
//                                 <thead>
//                                     <tr className="bg-accent">
//                                         <th>Billing Id </th>
//                                         <th>Billing No. </th>
//                                         <th>Customer Name </th>
//                                         <th>Customer Table Number </th>
//                                         <th>KOT/Paid </th>
//                                         <th>Customer Total Amount </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <tr>
//                                         <td>{BillingData?.billingID} </td>
//                                         <td>{BillingData?.bill_no} </td>
//                                         <td>{BillingData?.customer_name} </td>
//                                         <td>{BillingData?.customer_table} </td>
//                                         <td>{BillingData?.isDone} </td>
//                                         <td>{BillingData?.amount?.paybalamount} </td>
//                                     </tr>
//                                 </tbody>
//                             </table>
//                             {BillingData?.isDone == "KOT" ? <div className="flex w-full flex-wrap mt-5 justify-around">
//                                 <Link className='btn btn-info' href={/updatecustomer/${BillingData?._id}?tableid=${BillingData.table_id}&tablename=${BillingData.customer_table}} >Update</Link>
//                                 <button className='btn btn-info' onClick={BillingUpdateDone} >Mark As Done</button>
//                                 <button className='btn btn-info' onClick={BillingUpdateCancel} >Mark As Cancel</button>
//                             </div> :
//                                 <div className="flex w-full flex-wrap mt-5 justify-around">

//                                     <select
//                                         value={FormData}
//                                         onChange={(e) => setFormData(e.target.value)}
//                                         className="input input-bordered w-full max-w-xs">
//                                         <option>select</option>
//                                         <option value="Cash">Cash</option>
//                                         <option value="Online">Online</option>
//                                         <option value="Card">Card</option>
//                                     </select>
//                                     <button className='btn btn-info' onClick={HandleUpdatePayment}  >Update Payment</button>
//                                     <Link className='btn btn-info' href={/bill/${BillingData?._id}}>Print</Link>

//                                 </div>

//                             }
//                         </div>

//                     </div>
//                 </div>
//             )}
//         </div >
//     )
// }

// tablestatus.adminRoute = true
// export default tablestatus