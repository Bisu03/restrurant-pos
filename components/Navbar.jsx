import Link from "next/link";
import React from "react";
import { signOut } from "next-auth/react";
import { MdLogout, MdFastfood, MdTableRestaurant } from "react-icons/md";
import { FaUtensils, FaMoneyBillWave, FaHamburger } from "react-icons/fa";

const Navbar = () => {
    return (
        <nav className="bg-yellow-500 fixed top-0 left-0 w-full shadow-lg z-10">
            <div className=" mx-auto flex justify-between items-center py-2 px-5 w-full">

                {/* Restaurant Logo */}
                <div className="flex items-center gap-3 text-white text-xl font-bold">
                    <FaHamburger size={30} className="shrink-0" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-xs">LPOS</span>
                        <span className="text-sm">Popular Restrurant</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <ul className="flex gap-6 text-white font-semibold text-sm">
                    <li>
                        <Link href="/tablestatus" className="flex items-center gap-2 hover:text-gray-300 transition">
                            <MdTableRestaurant size={20} /> Tables
                        </Link>
                    </li>

                    {/* Customer Dropdown */}
                    {/* Customer Dropdown */}
                    <li className="relative group">
                        <button className="flex items-center gap-2 hover:text-gray-300 transition">
                            <FaUtensils size={20} /> Customer
                        </button>
                        <ul className="absolute left-0 top-full bg-yellow-600 rounded-lg w-44 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
                            <li>
                                <Link href="/addcustomer" className="block px-4 py-2 hover:bg-yellow-700 rounded-t-lg">🍽️ New</Link>
                            </li>
                            <li>
                                <Link href="/records" className="block px-4 py-2 hover:bg-yellow-700 rounded-b-lg">📜 List</Link>
                            </li>
                        </ul>
                    </li>


                    {/* Item Dropdown */}
                    <li className="relative group">
                        <button className="flex items-center gap-2 hover:text-gray-300 transition">
                            <MdFastfood size={20} /> Menu
                        </button>
                        <ul className="absolute left-0 top-full bg-yellow-600 rounded-lg  w-44 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-10">
                            <li>
                                <Link href="/item" className="block px-4 py-2 hover:bg-yellow-700 rounded-t-lg">🍕 Add Items</Link>
                            </li>
                            <li>
                                <Link href="/category" className="block px-4 py-2 hover:bg-yellow-700 rounded-b-lg">🍔 Add Category</Link>
                            </li>
                        </ul>
                    </li>



                    <li>
                        <Link href="/income" className="flex items-center gap-2 hover:text-gray-300 transition">
                            <FaMoneyBillWave size={20} /> Income
                        </Link>
                    </li>
                </ul>

                {/* Logout Button */}
                <button
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    onClick={() => signOut()}
                >
                    <MdLogout size={20} /> Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;


