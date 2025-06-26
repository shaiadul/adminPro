"use client";
import Cookies from "js-cookie";
import AddProductDynamicHead from "@/components/dashboard/addproduct/DynamicHead";
import AddProductRichText from "@/components/dashboard/addproduct/ProductRichText";
import AddProductShortDesRichText from "@/components/dashboard/addproduct/ProductShortDesRichText";
import { fetchCategories } from "@/redux/slice/categorySlice";
import { fetchApi } from "@/utils/FetchApi";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ScheduleSection from "@/components/dashboard/addproduct/ScheduleSection";

export default function AddProductPage() {
  const [bannerFile, setBannerFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryId, setCategoryId] = useState([]);
  const [division, setDivision] = useState([]);
  const [cat, setCat] = useState([]);
  // const [productStatus, setProductStatus] = useState("Draft");
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
  const user = useSelector((state) => state.user?.items || {});

  useEffect(() => {
    console.log("bannerFile state updated:", bannerFile);
  }, [bannerFile]);

  const router = useRouter();
  const fileInputRef = useRef(null);

  const addTicket = () => {
    setTickets([...tickets, { type: "", price: "", totalQty: "" }]);
  };

  const updateTicket = (index, field, value) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const formData = new FormData();

    // Basic fields
    formData.append("title", e.target.title.value);
    formData.append("description", e.target.description.value);
    formData.append("startDate", datePickers.startDate);
    formData.append("endDate", datePickers.endDate);
    formData.append("additionalNotes", e.target.additionalNotes.value);
    formData.append("venue", organization.venue);
    formData.append("organizer", "tata tata");
    formData.append("category", cat);

    // Tickets and Schedule as JSON strings
    formData.append("tickets", JSON.stringify(tickets));
    formData.append("schedule", JSON.stringify(schedule));

    // Organizer Info
    formData.append("OrganizerName", organization.organizationName);
    formData.append("OrganizerEmail", organization.organizationEmail);
    formData.append("OrganizerPhone", organization.organizationPhone);
    formData.append("OrganizerAboutUs", organization.organizationAboutUs);

    // Venue Info
    formData.append("venueImage", organization.venueImage);
    formData.append("venueUrl", organization.venueUrl);
    formData.append("division", division);

    // Files
    if (bannerFile) {
      formData.append("banner", bannerFile); // Must match backend field name
    } else {
      console.log("❌ No banner file selected.");
      return;
    }

    // Optional: Add venueImage too if available
    // formData.append("venueImage", venueImageFile);

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://ticketase-ng4x.onrender.com/api/v1/events/createEvents",
        {
          method: "POST",
          headers: myHeaders,
          body: formData,
        }
      );

      const result = await response.json();
      setIsLoading(false);

      if (response.ok) {
        localStorage.removeItem("Description");
        localStorage.removeItem("ShortDescription");
        router.push("/dashboard/products");
      } else {
        console.error("Failed to create event:", result);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <main className="">
      {isLoading && <Loading />}

      <form onSubmit={handleAddProduct}>
        <section className="mt-10 flex justify-between items-center">
          <AddProductDynamicHead title={"Add New Product"} />
          <button
            type="submit"
            className={`text-sm text-white bg-black rounded-md px-3 py-2 ${
              categoryId === "" ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isLoading ? "Adding Product..." : "Add Product"}
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
                    required
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
                    required
                    className=""
                  />
                </div>
              </div>
            </div>

            {/* Tickets Section */}
            <div className="p-5 border bg-white rounded-md shadow-md w-full">
              <h5 className="text-md font-bold mb-3">Ticket Information</h5>
              {tickets.map((ticket, index) => (
                <div key={index} className="flex gap-4 mb-3">
                  <input
                    type="text"
                    placeholder="Type (e.g., General)"
                    value={ticket.type}
                    onChange={(e) =>
                      updateTicket(index, "type", e.target.value)
                    }
                    className="border p-2 flex-1 focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={ticket.price}
                    onChange={(e) =>
                      updateTicket(index, "price", e.target.value)
                    }
                    className="border p-2 flex-1 focus:outline-none"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={ticket.totalQty}
                    onChange={(e) =>
                      updateTicket(index, "totalQty", e.target.value)
                    }
                    className="border p-2 flex-1 focus:outline-none"
                    required
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
              {/* <AddProductRichText preValue="" /> */}
              <textarea
                placeholder="Description"
                name="description"
                className="border p-2 flex-1 focus:outline-none w-full"
              />
            </div>

            {/* Schedule Section */}
            <ScheduleSection schedule={schedule} setSchedule={setSchedule} />

            <div className="p-5 border bg-white rounded-md shadow-md w-full">
              <h5 className="text-md font-bold mb-3">Additional Notes</h5>
              {/* <AddProductShortDesRichText /> */}
              <textarea
                placeholder="Additional Notes"
                name="additionalNotes"
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
                    className="border border-gray-300 rounded-md p-2 focus:outline-none w-full"
                    onChange={(e) =>
                      setDatePickers({
                        ...datePickers,
                        startDate: e.target.value,
                      })
                    }
                    required
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
                    required
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
                required
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
                required
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
                required
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
                required
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
                required
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
                    required
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
                    required
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
                    required
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
                    required
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
