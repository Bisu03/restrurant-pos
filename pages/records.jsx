import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingScreen from "../components/LoadingScreen";
import CustomerTable from "../components/CustomerTable";

const records = () => {
    const [Loading, setLoading] = useState(false);
    const [CustomerRecords, setCustomerRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [getDate, setDate] = useState({
        fromdate: new Date().toISOString().substring(0, 10),
        todate: new Date().toISOString().substring(0, 10),
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10; // Number of records per page

    const handleChange = (e) => {
        setDate({ ...getDate, [e.target.name]: e.target.value });
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `/api/customer/getcustomer?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}&fromdate=${getDate.fromdate}&todate=${getDate.todate}`
            );
            setCustomerRecords(data?.list);
            setTotalPages(Math.ceil(data.totalCount / pageSize));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };


    useEffect(() => {
        fetchData();
    }, [searchQuery, getDate, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div className="min-h-screen bg-base-100">
            <Navbar />

            <div className="mx-auto mt-24  px-4">
                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                    {/* Search Input */}
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered input-sm w-full md:w-auto flex-grow"
                        placeholder="Search by Billing No."
                    />
           

                    {/* Date Filters */}
                    <input
                        type="date"
                        name="fromdate"
                        value={getDate.fromdate}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full md:w-auto"
                    />
                    <input
                        type="date"
                        name="todate"
                        value={getDate.todate}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full md:w-auto"
                    />
                </div>
            </div>




            {Loading && <LoadingScreen />}
            <div className="my-4">
                <div className="overflow-x-auto h-[80vh] ">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className="bg-accent">
                                <th></th>
                                <th>Billing Id </th>
                                <th>Billing No. </th>
                                <th>Customer Name </th>
                                <th>Customer Table Number </th>
                                <th>Billing Date </th>
                                <th>KOT/Paid </th>
                                <th>Payment Mode </th>
                                <th>Delivery Type </th>
                                <th>Customer Total Amount </th>
                                <th>Action </th>
                            </tr>
                        </thead>
                        <tbody>
                            {CustomerRecords?.map((data, index) => (
                                <CustomerTable
                                    CustomerRecord={data}
                                    index={index}
                                    key={index}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex w-full justify-center">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}>
                            «
                        </button>

                        <button
                            className="join-item btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}>
                            »
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

records.adminRoute = true;
export default records;
