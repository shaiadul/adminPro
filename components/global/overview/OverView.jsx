export default function OverView() {
  return (
    <section className="my-5 bg-white">
      <div className="flex justify-end items-center">
        <h5 className="text-2xl font-bold">Overview</h5>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 my-3 ">
        <div className="bg-[#F9FAFB] p-5 rounded-md hover:bg-[#c8c9c986] shadow-md duration-700">
          <p className="text-[#6B7280] mb-2">Total Sales</p>
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] font-bold">55689৳</h1>
            <div className="flex justify-center text-green-500 text-md">
              <p className="">+5.6%</p>
              <p className="">&#x2191;</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9FAFB] p-5 rounded-md hover:bg-[#c8c9c986] shadow-md duration-700">
          <p className="text-[#6B7280] mb-2">Net Sales</p>
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] font-bold">84589৳</h1>
            <div className="flex justify-center text-red-500 text-md">
              <p className="">+5.6%</p>
              <p className="">&#x2193;</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9FAFB] p-5 rounded-md hover:bg-[#c8c9c986] shadow-md duration-700">
          <p className="text-[#6B7280] mb-2">Total Sales</p>
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] font-bold">556</h1>
            <div className="flex justify-center text-green-500 text-md">
              <p className="">+5.6%</p>
              <p className="">&#x2191;</p>
            </div>
          </div>
        </div>
        <div className="bg-[#F9FAFB] p-5 rounded-md hover:bg-[#c8c9c986] shadow-md duration-700">
          <p className="text-[#6B7280] mb-2">Total Order Today</p>
          <div className="flex justify-between items-center">
            <h1 className="text-[30px] font-bold">15</h1>
            <div className="flex justify-center text-red-500 text-md">
              <p className="">&#x2193;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
