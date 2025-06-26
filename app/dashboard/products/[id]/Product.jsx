"use client";
import * as XLSX from "xlsx";
import AddProductDynamicHead from "@/components/dashboard/addproduct/DynamicHead";
import AddProductRichText from "@/components/dashboard/addproduct/ProductRichText";
import AddProductShortDesRichText from "@/components/dashboard/addproduct/ProductShortDesRichText";
import { fetchApi } from "@/utils/FetchApi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loading from "../../loading";
import Skeleton from "@/components/global/skeleton/Skeleton";
import ScheduleSection from "@/components/dashboard/addproduct/ScheduleSection";

export default function Product({ product }) {
  const [bannerFile, setBannerFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [division, setDivision] = useState([]);
  const [cat, setCat] = useState([]);
  const [organization, setOrganization] = useState({
    organizationName: "",
    organizationEmail: "",
    organizationPhone: "",
    organizationAboutUs: "",
    venue: "",
    venueImage: "",
    venueUrl: "",
  });
  const [datePickers, setDatePickers] = useState({
    startDate: "",
    endDate: "",
  });
  const [tickets, setTickets] = useState([
    { type: "", price: "", totalQty: "" },
  ]);

  const [schedule, setSchedule] = useState({});

  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (window !== undefined) {
      setCat(product?.category);
      setDivision(product?.division);

      setDatePickers({
        startDate: product?.startDate,
        endDate: product?.endDate,
      });
      setOrganization({
        organizationName: product?.OrganizerName,
        organizationEmail: product?.OrganizerEmail,
        organizationPhone: product?.OrganizerPhone,
        organizationAboutUs: product?.OrganizerAboutUs,
        venue: product?.venue,
        venueImage: product?.venueImage,
        venueUrl: product?.venueUrl,
      });
      setTickets(product?.tickets);
      setSchedule(product?.schedule);

     
    }
  }, [product]);

  const addTicket = () => {
    setTickets([...tickets, { type: "", price: "", totalQty: "" }]);
  };

  const updateTicket = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!product) return;

    const formData = new FormData();
    const payload = {
      title: e.target.title.value,
      description: e.target.description.value,
      additionalNotes: e.target.additionalNotes.value,
      startDate: datePickers.startDate,
      endDate: datePickers.endDate,
      division: division,
      category: cat,
      tickets: tickets,
      schedule: schedule,
      OrganizerName: organization.organizationName,
      OrganizerEmail: organization.organizationEmail,
      OrganizerPhone: organization.organizationPhone,
      OrganizerAboutUs: organization.organizationAboutUs,
      venue: organization.venue,
      venueImage: organization.venueImage,
      venueUrl: organization.venueUrl,
      
    };
    console.log("payload", payload);
    setIsLoading(true);
    try {
      await fetchApi(`/events/updateEvent/${product?._id}`, "PUT", payload);
      router.push(`/dashboard/products`);
      localStorage.removeItem("Description");
      localStorage.removeItem("ShortDescription");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="">
      {isLoading && <Loading />}
      {product ? (
        <form onSubmit={handleSubmit}>
          <section className="mt-10 flex justify-between items-center">
            <AddProductDynamicHead title={product?.title} />
            <button
              type="submit"
              className="text-sm text-white bg-black rounded-md px-3 py-2"
            >
              {isLoading ? "Updating Product..." : "Update Product"}
            </button>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 justify-between items-start gap-5 w-full my-10">
            <div className="flex flex-col justify-start items-center w-full md:col-span-2 space-y-5">
              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">General</h5>
                <div className="grid grid-cols-1">
                  <div className="flex flex-col space-y-1 w-full">
                    <label
                      htmlFor="title"
                      className="text-sm font-semibold text-gray-600"
                    >
                      Product title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      defaultValue={product?.title}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none "
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-between items-start">
                  <div className="flex flex-col justify-between items-start space-y-3">
                    <h5 className="text-md font-bold mb-3">Featured Image</h5>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log("File selected:", file);
                          setBannerFile(file);
                        }
                      }}
                      id="file-upload"
                      ref={fileInputRef}
                      className=""
                    />
                  </div>
                </div>
              </div>

              {/* Tickets Section */}
              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Ticket Information</h5>
                {tickets?.map((ticket, index) => (
                  <div key={index} className="flex gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Type (e.g., General)"
                      value={ticket.type}
                      onChange={(e) =>
                        updateTicket(index, "type", e.target.value)
                      }
                      className="border p-2 flex-1 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicket(index, "price", e.target.value)
                      }
                      className="border p-2 flex-1 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ticket.totalQty}
                      onChange={(e) =>
                        updateTicket(index, "totalQty", e.target.value)
                      }
                      className="border p-2 flex-1 focus:outline-none"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTicket}
                  className="mt-2 text-primary underline"
                >
                  + Add Another Ticket Type
                </button>
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Product Description</h5>
                  <textarea
                placeholder="Description"
                name="description"
                defaultValue={product?.description}
                className="border p-2 flex-1 focus:outline-none w-full"
              />
              </div>

              {/* Schedule Section */}
              <ScheduleSection schedule={schedule} setSchedule={setSchedule} />

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Additional Notes</h5>
                <textarea
                  placeholder="Additional Notes"
                  name="additionalNotes"
                  defaultValue={product?.additionalNotes}
                  className="border p-2 flex-1 focus:outline-none w-full"
                />
              </div>
            </div>

            <div className="flex flex-col justify-end items-center w-full space-y-5">
              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Date and Time</h5>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="startDate">Started Date</label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={datePickers.startDate}
                      defaultValue={product.startDate}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                      onChange={(e) =>
                        setDatePickers({
                          ...datePickers,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={datePickers.endDate}
                      className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                      onChange={(e) =>
                        setDatePickers({
                          ...datePickers,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Product Categories</h5>

                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  placeholder="Category Name"
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                />
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Division</h5>

                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  placeholder="Division"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Venue Information</h5>

                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  placeholder="Venue Name"
                  value={organization.venue}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      venue: e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  placeholder="Venue Image"
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      venueImage: e.target.files[0],
                    })
                  }
                  ref={fileInputRef}
                />

                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                  placeholder="Venue Map Url"
                  value={organization.venueUrl}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      venueUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">
                  Organization information
                </h5>

                <div className="mt-3 font-semibold text-sm">
                  <div className="flex flex-col">
                    <span>Organization Name </span>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none"
                      value={organization.organizationName}
                      onChange={(e) =>
                        setOrganization({
                          ...organization,
                          organizationName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span>Organization Phone</span>
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none"
                      value={organization.organizationPhone}
                      onChange={(e) =>
                        setOrganization({
                          ...organization,
                          organizationPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span>Organization Email</span>
                    <input
                      type="email"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none"
                      value={organization.organizationEmail}
                      onChange={(e) =>
                        setOrganization({
                          ...organization,
                          organizationEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mt-3 flex flex-col">
                    <span> About Organization </span>
                    <textarea
                      className="border border-gray-300 rounded-md p-2 focus:outline-none"
                      value={organization.organizationAboutUs}
                      onChange={(e) =>
                        setOrganization({
                          ...organization,
                          organizationAboutUs: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      ) : (
        <Skeleton />
      )}
    </main>
  );
}
