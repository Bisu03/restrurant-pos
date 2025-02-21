import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AiFillCloseCircle } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";

const CustomerTable = ({ CustomerRecord, index }) => {
    const { data: session } = useSession();
    const router = useRouter()

    const [ChangeColor, setChangeColor] = useState(false);
    const [Show, setShow] = useState(false);

    const [FormData, setFormData] = useState("");

    const BillingUpdateCancel = async () => {
        try {
            await axios.put(
                "/api/customer/updatestatus/" + CustomerRecord?._id,
                { isDone: "Cancel" }
            );
            location.reload();
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong");
        }
    };
    const BillingUpdate = async () => {
        try {
            await axios.put(
                "/api/customer/updatestatus/" + CustomerRecord?._id,
                { isDone: "Done" }
            );
            location.reload();
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong");
        }
    };

    const HandleUpdatePayment = async () => {
        try {
            await axios.put(
                "/api/customer/updatepayment/" + CustomerRecord?._id,
                { payment_mode: FormData, tableid: CustomerRecord?.table_id }
            );
            router.push(`/bill/${CustomerRecord?._id}`)

        } catch (error) {
            console.log(error);
            toast.warn("something went wrong");
        }
    };
    const HandleDelete = async () => {
        try {
            const { data } = await axios.delete(
                "/api/customer/deletecustomer/" + CustomerRecord?._id
            );
            location.reload();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.warn("something went wrong");
        }
    };

    return (
        <>
            <tr className="hover:bg-base-200 transition-colors group">
                <td className="font-medium">{index + 1}</td>
                <td className="text-primary">{CustomerRecord.billingID}</td>
                <td>#{CustomerRecord.bill_no}</td>
                <td className="font-semibold">{CustomerRecord.customer_name}</td>
                <td>
                    <div className="badge badge-neutral">
                        🪑 Table {CustomerRecord.customer_table}
                    </div>
                </td>
                <td className="text-sm">
                    {CustomerRecord.billing_date.split("-").reverse().join("-")}
                </td>
                <td>
                    {CustomerRecord.isDone === "KOT" ? (
                        <div className="badge badge-warning gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Preparing
                        </div>
                    ) : CustomerRecord.isDone === "Done" ? (
                        CustomerRecord.payment_mode ?
                            <div className="badge badge-success gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Paid
                            </div> :
                            <div className="badge badge-info gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                </svg>
                                Unpaid
                            </div>
                    ) : (
                        <div className="badge badge-error gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Cancelled
                        </div>
                    )}
                </td>
                <td>
                    {CustomerRecord.payment_mode && (
                        <div className="badge badge-outline">
                            {CustomerRecord.payment_mode}
                        </div>
                    )}
                </td>
                <td>
                    <div className="badge badge-accent">
                        {CustomerRecord.delivery_type}
                    </div>
                </td>
                <td className="font-bold">₹{CustomerRecord.amount.paybalamount}</td>
                <td>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            {CustomerRecord.isDone === "Done" && <li>
                                <Link href={`/bill/${CustomerRecord?._id}`} className="hover:bg-base-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    Print Bill
                                </Link>
                            </li>}
                            {CustomerRecord?.isDone == "KOT" && (
                                <>
                                    <li>
                                        <button onClick={BillingUpdate} className="hover:bg-base-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Mark as Done
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={BillingUpdateCancel} className="hover:bg-base-200 text-error">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Mark as Cancel
                                        </button>
                                    </li>
                                    <li>
                                        <Link
                                            href={`/updatecustomer/${CustomerRecord?._id}?tableid=${CustomerRecord.table_id}&tablename=${CustomerRecord.customer_table}`}
                                            className="hover:bg-base-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Update Order
                                        </Link>
                                    </li>
                                </>
                            )}
                            {!CustomerRecord.payment_mode && <li>
                                <button onClick={() => setShow(!Show)} className="hover:bg-base-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                    </svg>
                                    Payment Method
                                </button>
                            </li>}
                            {session?.user.isSuperAdmin && (
                                <>
                                    <li>
                                        <button onClick={HandleDelete} className="hover:bg-error/20 text-error">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Delete Order
                                        </button>
                                    </li>
                                    <li>
                                        <Link
                                            href={`/updatecustomer/${CustomerRecord?._id}?tableid=${CustomerRecord.table_id}&tablename=${CustomerRecord.customer_table}`}
                                            className="hover:bg-base-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Update Order
                                        </Link>
                                    </li>

                                </>

                            )}
                        </ul>
                    </div>
                </td>
            </tr>

            {Show && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Select Payment Method</h3>
                            <button onClick={() => setShow(false)} className="btn btn-sm btn-circle btn-ghost">
                                ✕
                            </button>
                        </div>
                        <div className="form-control">
                            <select
                                className="select select-bordered w-full"
                                value={FormData}
                                onChange={(e) => setFormData(e.target.value)}
                            >
                                <option value="">Choose method</option>
                                <option value="Cash">💵 Cash</option>
                                <option value="Online">📱 Online</option>
                                <option value="Card">💳 Card</option>
                            </select>
                        </div>
                        <div className="modal-action">
                            <button onClick={HandleUpdatePayment} className="btn btn-primary w-full">
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CustomerTable;
