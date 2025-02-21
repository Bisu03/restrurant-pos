import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "../../components/Navbar";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import LoadingScreen from "../../components/LoadingScreen";
import axios from "axios";
import Image from "next/image";

const Bill = () => {
  const router = useRouter();
  const { bill } = router.query;
  const [printLoading, setPrintLoading] = useState(false);
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/customer/getbyid/` + bill);
      setBillingData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bill) fetchBillingData();
  }, [bill]);

  const componentRef = useRef();

  const reactToPrintContent = useCallback(() => componentRef.current, []);

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: `${bill}`,
    removeAfterPrint: true,
    onBeforeGetContent: () => setPrintLoading(true),
    onAfterPrint: () => setPrintLoading(false),
  });

  return (
    <div>
      <div className="print:hidden">
        <Navbar />
      </div>

      {loading && <LoadingScreen />}

      <div className="py-8 w-full print:p-0">
        <div
          className="max-w-[20rem] mx-auto p-10 bg-white shadow-md print:shadow-none print:p-2"
          ref={componentRef}
        >
          <div className="flex justify-center w-full mt-2">
            {/* <Image
              src="/logo.png"
              width={40}
              height={40}
              className="aspect-square"
              alt="Logo"
            /> */}
          </div>
          <div className="text-center">
            <h2 className="text-lg font-bold">Popular Restrurant</h2>
            <h2 className="text-sm font-semibold">
              Salgechiya, Opposite Old D.M.Office, Tamluk - 721636
            </h2>
            <h2 className="text-xs font-semibold">+91 96353 22579</h2>
          </div>

          {/* <p className="text-xs text-center mt-1">GST NO. -</p> */}
          <p className="text-xs text-center mb-1">
            ORDER NO. {billingData?.bill_no?.toString().padStart(2, "0")}/
            {billingData?.billingID}
          </p>
          {billingData?.customer_table && (
            <p className="text-xs text-center mb-1">
              TABLE NO. - {billingData?.customer_table}
            </p>
          )}
          <hr />
          <div className="flex justify-between w-full text-[12px]">
            <p>{billingData?.delivery_type}</p>
            <p>
              {billingData?.billing_date?.split("-").reverse().join("-")} /{" "}
              {billingData?.billing_time}
            </p>
          </div>
          <hr />
          {billingData?.isDone === "Done" ? (
            <>
              <table className="table-auto text-[12px] w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Item</th>
                    <th className="p-2">Rate</th>
                    <th className="p-2">QTY</th>
                    <th className="p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {billingData?.ordered?.map((data, index) => (
                    <tr key={index}>
                      <td className="text-[10px]">{data.item_name}</td>
                      <td className="text-[10px] text-center">
                        {data.item_cost}
                      </td>
                      <td className="text-[10px] text-center">{data.qty}</td>
                      <td className="text-[10px] text-center">
                        {(data.qty * data.item_cost).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              <div className="mt-4 flex justify-between w-full text-[10px]">
                <p>SUB TOTAL</p>
                <p>
                  {parseFloat(billingData?.amount?.totalcharge)?.toFixed(2)}/-
                </p>
              </div>
              {billingData?.amount?.gst > 0 && (
                <>
                  <div className="mt-1 flex justify-between w-full text-[10px]">
                    <p>CGST</p>
                    <p>{billingData?.amount?.gst / 2}%</p>
                  </div>
                  <div className="mt-1 flex justify-between w-full text-[10px]">
                    <p>SGST</p>
                    <p>{billingData?.amount?.gst / 2}%</p>
                  </div>
                </>
              )}
              {billingData?.amount?.discount > 0 && (
                <div className="mt-1 flex justify-between w-full text-[10px]">
                  <p>DISCOUNT</p>
                  <p>
                    {parseFloat(billingData?.amount?.discount)?.toFixed(2)}/-
                  </p>
                </div>
              )}
              {billingData?.amount?.paybalamount && (
                <div className="mt-1 flex justify-between w-full text-[10px]">
                  <p>GRAND TOTAL</p>
                  <p>
                    {parseFloat(billingData?.amount?.paybalamount)?.toFixed(2)}
                    /-
                  </p>
                </div>
              )}
              <hr />
              <div className="text-center text-xs">
                {billingData?.customer_name && (
                  <p>Name: {billingData?.customer_name}</p>
                )}
                {billingData?.customer_contact && (
                  <p>Ph: {billingData?.customer_contact}</p>
                )}
                {billingData?.payment_mode && (
                  <p>Paid By {billingData?.payment_mode}</p>
                )}
                
                <p className="font-bold">**THANK YOU VISIT AGAIN**</p>
              </div>
            </>
          ) : (
            <div className="h-[20vh] flex justify-center items-center">
              Billing Not Done
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center print:hidden">
        <button
          className="btn btn-primary"
          onClick={handlePrint}
          disabled={printLoading}
        >
          {printLoading ? "Printing..." : "Print"}
        </button>
      </div>
    </div>
  );
};

Bill.adminRoute = true;
export default Bill;
