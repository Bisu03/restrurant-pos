import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";

const ItemsTable = ({ data: ItemData, index }) => {

  const { data: session } = useSession()

  const [ChangeColor, setChangeColor] = useState(false);
  const [Show, setShow] = useState(false)

  const [FormData, setFormData] = useState(ItemData);
  const HandleChange = (e) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };


  const HandleUpdate = async () => {
    try {
      const { data } = await axios.put("/api/items/updateitems/" + ItemData?._id, { ...FormData })
      location.reload()
      toast.success(data.message)
    } catch (error) {
      console.log(error);
      toast.warn("something went wrong")
    }
  }
  const HandleDelete = async () => {
    try {
      const { data } = await axios.delete("/api/items/deleteitems/" + ItemData?._id)
      location.reload()
      toast.success(data.message)
    } catch (error) {
      console.log(error);
      toast.warn("something went wrong")
    }
  }

  return (
    <>
      <tr className="text-center">
        <th>{index + 1}</th>
        <td>{ItemData.item_cate}</td>
        <td>{ItemData.item_name}</td>
        <td>{ItemData.item_desc}</td>
        <td>{ItemData.item_cost} /-</td>
        {session?.user?.isSuperAdmin && <td>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              onClick={() => setChangeColor(!ChangeColor)}
              className={`btn ${ChangeColor ? "btn-error" : "btn-success"}`}>
              Action
              <svg
                width="12px"
                height="12px"
                className="h-2 w-2 fill-current opacity-60 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048">
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-52">
              <li>
                <button
                  className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                  aria-label="Default"
                  value="default"
                  onClick={() => setShow(!Show)}
                >Update</button>
              </li>
              <li>
                <button
                  className="theme-controller btn btn-sm btn-block btn-error justify-start"
                  aria-label="Default"
                  value="default"
                  onClick={HandleDelete}
                >Delete</button>
              </li>
            </ul>
          </div>
        </td>}
      </tr>

      {Show && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-info">
        <AiFillCloseCircle className="m-2 h-8 w-8" onClick={() => setShow(!Show)} />
        <div className="flex flex-wrap w-full justify-between  p-8 ">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Category</span>
            </div>
            <select
              name="item_cate"
              value={FormData.item_cate}
              onChange={HandleChange}
              placeholder="Type here"
              className="select select-bordered w-full max-w-xs"
            >
              <option>select</option>
              <option value="STARTER">STARTER</option>
              <option value="RICE INDIAN">RICE INDIAN</option>
              <option value="DAL">DAL</option>
              <option value="MAIN COURSE VEG">MAIN COURSE VEG</option>
              <option value="MAIN COURSE NON VEG">MAIN COURSE NON VEG</option>
              <option value="ROTI & NAAN">ROTI & NAAN</option>
              <option value="DESSERT">DESSERT</option>
              <option value="SOUP">SOUP</option>
              <option value="CRUNCH N MUNCH">CRUNCH N MUNCH</option>
              <option value="STARTER VEG">STARTER VEG</option>
              <option value="CHINESE RICE AND NOODLES">CHINESE RICE AND NOODLES</option>
              <option value="CHINESE SIDE DISHES">CHINESE SIDE DISHES</option>
              <option value="RICE">RICE</option>
              <option value="DAHI & RAITA">DAHI & RAITA</option>
              <option value="CONTINENTAL & OTHERS">CONTINENTAL & OTHERS</option>
              <option value="MOCKTAILS">MOCKTAILS</option>
            </select>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Name</span>
            </div>
            <input
              type="text"
              name="item_name"
              value={FormData.item_name}
              onChange={HandleChange}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Desc</span>
            </div>
            <input
              type="text"
              name="item_desc"
              value={FormData.item_desc}
              onChange={HandleChange}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Item Cost</span>
            </div>
            <input
              type="tel"
              name="item_cost"
              value={FormData.item_cost}
              onChange={HandleChange}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </label>
          <div className="flex w-full justify-center my-4">
            <button className="btn btn-wide btn-error" onClick={HandleUpdate}>Update</button>
          </div>
        </div>
      </div>}
    </>
  );
};

export default ItemsTable;
