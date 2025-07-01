"use client";
import CouponDynamicHead from "@/components/dashboard/coupon/dynamic/CouponDynamicHead";
import { fetchApi } from "@/utils/FetchApi";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function SingleCoupon({ coupon }) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const router = useRouter();

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);

    const data = {
      code: formData.get("couponName"),
      discountType: formData.get("discountType"),
      discountValue: formData.get("couponAmount"),
      isActive: formData.get("activateCoupon") === "on" ? true : false,
      usageLimit: formData.get("minimumSpend"),
      maxDiscountAmount: formData.get("maxDiscountAmount"),
      validFrom: formData.get("validFrom"),
      validTo: formData.get("validTo"),
      description: formData.get("description"),
    };
    console.log("sending data", data);
    try {
      const response = await fetchApi(
        `/promo/updatePromo/${coupon?._id}`,
        "PUT",
        data
      );

      console.log("update coupon response", response);

      if (response) {
        setIsLoading(false);
        router.push("/dashboard/coupon");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <main>
      <form onSubmit={handleUpdateCoupon} className="w-full">
        <section className="mt-10 flex justify-between items-center">
          <CouponDynamicHead coupon={coupon} />
          <button
            type="submit"
            className="text-sm text-white bg-black rounded-md px-3 py-2"
          >
            {isLoading ? "Updating Coupon..." : "Update Coupon"}
          </button>
        </section>

        <section className=" mt-10">
          <div className="flex gap-x-2 my-5">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`${
                activeTab === "general"
                  ? "border-gray-500 text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center py-2 px-4 border-b-2 text-center text-nowrap font-medium focus:outline-none bg-gray-100 w-full rounded-md `}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("usage")}
              className={`${
                activeTab === "usage"
                  ? "border-gray-500 text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center py-2 px-4 border-b-2 text-center text-nowrap font-medium focus:outline-none bg-gray-100 w-full rounded-md `}
            >
              Limit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("limits")}
              className={`${
                activeTab === "limits"
                  ? "border-gray-500 text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex items-center py-2 px-4 border-b-2 text-center text-nowrap font-medium focus:outline-none bg-gray-100 w-full rounded-md `}
            >
              Info
            </button>
          </div>
        </section>

        <section
          className={`
              ${activeTab === "general" ? "block" : "hidden"} 
              border bg-white rounded-md shadow-md p-5 my-10
            `}
        >
          <div className="flex justify-between items-center mt-5">
            <h2 className="text-black font-bold text-2xl">General</h2>
          </div>
          <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Coupon Name</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="text"
                    id="couponName"
                    name="couponName"
                    defaultValue={coupon?.code}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Discount Type </h4>
              <div className="">
                <div>
                  <div className="relative flex border border-gray-300 px-2 mt-1 rounded-md bg-white hover:border-gray-400">
                    <select
                      id="discountType"
                      name="discountType"
                      defaultValue={coupon?.discountType}
                      required
                      className=" text-gray-600 h-10 pl-5 pr-10 w-full focus:outline-none appearance-none"
                    >
                      <option value="fixed">Fixed</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Coupon Amount</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="number"
                    id="couponAmount"
                    name="couponAmount"
                    defaultValue={coupon?.discountValue}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Coupon Max Amount</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="number"
                    id="maxDiscountAmount"
                    name="maxDiscountAmount"
                    defaultValue={coupon?.maxDiscountAmount}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-start my-5">
              <h4 className="text-gray-600 text-sm ">Activate Coupon</h4>
              <div className="col-span-2">
                <div className="flex justify-start items-start gap-2">
                  <input
                    id="activateCoupon"
                    name="activateCoupon"
                    className="mt-1"
                    type="checkbox"
                    defaultChecked={coupon?.isActive}
                  />
                  <label
                    htmlFor="activateCoupon"
                    className="font-semibold text-md"
                  >
                    Activate Coupon ?
                  </label>
                </div>
              </div>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 justify-start items-center my-5">
              <h4 className="text-gray-600 text-sm ">Coupon Expiry Date</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="date"
                    id="couponExpiry"
                    name="couponExpiry"
                    defaultValue={coupon?.couponExpiry}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </section>
        <section
          className={`
              ${activeTab === "usage" ? "block" : "hidden"} 
              border bg-white rounded-md shadow-md p-5 my-10
            `}
        >
          <div className="flex justify-between items-center mt-5">
            <h2 className="text-black font-bold text-2xl">
              Limit Restrictions
            </h2>
          </div>
          <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Usage Limit</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="number"
                    id="minimumSpend"
                    name="minimumSpend"
                    defaultValue={coupon?.usageLimit}
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">valid From</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="date"
                    id="validFrom"
                    name="validFrom"
                    defaultValue={formatDate(coupon?.validFrom)}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">valid To</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <input
                    type="date"
                    id="validTo"
                    name="validTo"
                    defaultValue={formatDate(coupon?.validTo)}
                    required
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-[2px] bg-gray-100 my-10"></div>
          </div>
        </section>
        <section
          className={`
              ${activeTab === "limits" ? "block" : "hidden"} 
              border bg-white rounded-md shadow-md p-5 my-10
            `}
        >
          <div className="flex justify-between items-center mt-5">
            <h2 className="text-black font-bold text-2xl">Additional </h2>
          </div>
          <div className="my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center my-5">
              <h4 className="text-gray-600 text-sm ">Description</h4>
              <div className="">
                <div className="flex justify-start items-center gap-2">
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={coupon?.description}
                    s
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
