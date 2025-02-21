import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import LoadingScreen from '../components/LoadingScreen';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdDelete, MdFastfood } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';

const CategoryPage = () => {
    const { data: session } = useSession();
    const [Category, setCategory] = useState('');

    const { isLoading, data: CategoryRecord, refetch } = useQuery({
        queryKey: ['CategoryRecord'],
        queryFn: () => axios.get('/api/items/getcategory').then(res => res.data),
    });

    const HandleSubmit = async () => {
        try {
            const { data } = await axios.post('/api/items/addcategory', { category_name: Category });
            setCategory('');
            refetch();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.warn('Error adding category');
        }
    };

    const HandleDelete = async (id) => {
        try {
            const { data } = await axios.delete(`/api/items/deletecategory/${id}`);
            refetch();
            toast.success(data.message);
        } catch (error) {
            console.log(error);
            toast.warn('Error deleting category');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto mt-20 p-6">
                <h1 className="text-3xl font-bold text-center text-red-600 flex items-center justify-center gap-2">
                    <MdFastfood /> Manage Food Categories
                </h1>

                <div className="flex justify-center mt-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
                        <input
                            type="text"
                            name="Category"
                            value={Category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Enter category name"
                            className="input input-bordered w-64 p-2 border border-gray-300 rounded-lg"
                        />
                        <button className="btn btn-primary flex items-center gap-2 px-4 py-2" onClick={HandleSubmit}>
                            <FaPlus /> Add Category
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <div className="mt-8">
                        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="bg-red-500 text-white">
                                        <th className="p-2">#</th>
                                        <th className="p-2">Category Name</th>
                                        {session?.user?.isSuperAdmin && <th className="p-2">Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {CategoryRecord?.map((data, index) => (
                                        <tr key={index} className="border-b text-center">
                                            <td className="p-2">{index + 1}</td>
                                            <td className="p-2 font-semibold">{data.category_name}</td>
                                            {session?.user?.isSuperAdmin && (
                                                <td className="p-2">
                                                    <button
                                                        className="btn btn-error flex items-center gap-2 px-3 py-1"
                                                        onClick={() => HandleDelete(data._id)}
                                                    >
                                                        <MdDelete /> Delete
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

CategoryPage.adminRoute = true;
export default CategoryPage;
