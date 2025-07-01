"use client";

import UserDynamicHead from "@/components/dashboard/userpage/dynamic/UserDynamicHead";
import { fetchApi } from "@/utils/FetchApi";

import Image from "next/image";
import { useState, useEffect } from "react";
import Loading from "../../loading";
import useImgBBUpload from "@/utils/useImgBBUpload";
import { useRouter } from "next/navigation";
import ImageUploadModal from "@/components/global/modal/ImageUploadModal ";
import { removeImage } from "@/redux/slice/imagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchOutlets } from "@/redux/slice/outletSlice";

export default function SingleUser({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUserImageDeleted, setIsUserImageDeleted] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outlet, setOutlet] = useState("");

  const dispatch = useDispatch();
  const selectedImages = useSelector((state) => state.images.selectedImages);

  const { error, handleUpload, imageUrl, uploading } = useImgBBUpload();

  const router = useRouter();

  useEffect(() => {
    setUserImage(user?.profilePicture);
  }, []);

  useEffect(() => {
    dispatch(fetchOutlets());
  }, [dispatch]);

  const updateProfile = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const fromData = new FormData(e.target);

    const data = {
      username: fromData.get("userName"),

      name: fromData.get("name"),
      phone: fromData.get("phone"),
      email: fromData.get("email"),
    };

    try {
      const response = fetchApi(`/auth/users/${user?._id}`, "PUT", data);

      if (response) {
        setIsLoading(false);
        router.push("/dashboard/usermanagement");
        dispatch(removeImage());
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }

    console.log(data);
    setIsLoading(false);
  };

  const makeAdmin = async () => {
    if (!user?.email) {
      alert("No email found for this user.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchApi("/admin/generate-admin-invite", "POST", {
        email: user.email,
      });

      if (res?.success) {
        alert("Admin invitation sent successfully.");
      } else {
        alert("Failed to send admin invitation.");
      }
    } catch (error) {
      console.error("Make admin error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="">
      {isLoading ? (
        <Loading />
      ) : (
        <form onSubmit={updateProfile} action="">
          <section className="mt-10 flex justify-between items-center">
            <UserDynamicHead user={user} />
            <button
              type="submit"
              className="text-sm text-white bg-black rounded-md px-3 py-2"
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </section>

          <section className="grid grid-cols-1 justify-between items-start gap-5 w-full my-10">
            {/* main one section */}
            <div className="flex flex-col justify-start items-center w-full col-span-2 space-y-5">
              {/* one */}
              <div className="p-5 border bg-white rounded-md shadow-md w-full">
                <h5 className="text-md font-bold mb-3">Personal info</h5>
                <div className="grid grid-cols-1 justify-between items-start gap-5 ">
                  {/* <div className="flex flex-col justify-between items-start space-y-3">
                    {userImage && (
                      <div
                        className={`flex flex-col w-full ${isUserImageDeleted ? "hidden" : "block"
                          }`}
                      > 
                           <Image
                        width={145}
                        height={145}
                        src="http://service.bestelectronics.com.bd/media/images/user.png"
                        alt="Uploaded"
                        className="rounded-md"
                      />
          
                     <button
                          type="button"
                          onClick={handleRemoveUserPicture}
                          className="text-sm text-red-500 flex justify-start py-2 underline underline-offset-2"
                        >
                          Remove User Image
                        </button>
                      </div>
                    )}
                    {isUserImageDeleted && (
                      <div className="flex flex-col w-[145px]">
                        {selectedImages && (
                          <div>
                            <Image
                              width={145}
                              height={145}
                              src={selectedImages}
                              alt="Uploaded"
                              className="w-[145px] h-[145px] rounded-md"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveUserPicture}
                              className="text-sm text-red-500 flex justify-start py-2 underline underline-offset-2"
                            >
                              Remove User Image
                            </button>
                          </div>
                        )}

                        {!selectedImages ? (
                          <div onClick={openModal}>
                            <div className="z-20 flex flex-col-reverse items-center justify-center w-[145px] h-[145px] cursor-pointer border py-2 bg-gray-200 rounded-md">
                              <svg
                                width="21"
                                height="20"
                                viewBox="0 0 21 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.0925 2.4917C6.35684 2.4917 4.48901 2.4917 3.32849 3.65177C2.16797 4.81185 2.16797 6.67896 2.16797 10.4132C2.16797 14.1473 2.16797 16.0145 3.32849 17.1746C4.48901 18.3347 6.35684 18.3347 10.0925 18.3347C13.8281 18.3347 15.6959 18.3347 16.8565 17.1746C18.017 16.0145 18.017 14.1473 18.017 10.4132V9.99626"
                                  stroke="black"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M4.66602 17.4913C8.17433 13.5319 12.117 8.28093 17.9993 12.2192"
                                  stroke="black"
                                  strokeWidth="1.25"
                                />
                                <path
                                  d="M15.4982 1.66504V8.33847M18.8362 4.98087L12.1602 4.99327"
                                  stroke="black"
                                  strokeWidth="1.25"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-xs text-red-500">
                              * Upload an image for the User
                            </p>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    )}
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-5">
                    <div className="flex flex-col md:col-span-2 space-y-1 w-full">
                      <label
                        htmlFor="userName"
                        className="text-sm font-semibold text-gray-600"
                      >
                        User Name
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        defaultValue={user?.username}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none "
                      />
                    </div>

                    <div className="">
                      <label
                        htmlFor="ordaerDate"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Role
                      </label>
                      <br />
                      <div className="relative flex border border-gray-300 px-2 mt-1 rounded-md bg-white hover:border-gray-400">
                        <select
                          id="role"
                          name="role"
                          disabled
                          aria-readonly
                          className=" text-gray-600 h-10 pl-5 pr-10 w-full focus:outline-none appearance-none"
                        >
                          <option value={user?.role}>{user?.role}</option>
                          <option value={"SA"}>Super Admin</option>
                          <option value={"AD"}>Admin</option>
                          <option value={"user"}>User</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 w-full">
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={user?.name}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none "
                      />
                    </div>

                    <div className="flex flex-col space-y-1 w-full">
                      <label
                        htmlFor="outletName"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        defaultValue={user?.phone}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none "
                      />
                    </div>

                    <div className="flex flex-col space-y-1 w-full">
                      <label
                        htmlFor="outletLocation"
                        className="text-sm font-semibold text-gray-600"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        id="email"
                        name="email"
                        defaultValue={user?.email}
                        className="border border-gray-300 rounded-md p-2 focus:outline-none "
                      />
                    </div>
                    <button
                      type="button"
                      onClick={makeAdmin}
                      className="max-w-[150px] text-sm text-white bg-black rounded-md px-3 py-2 cursor-pointer"
                    >
                      {isLoading ? "Making..." : "Make Admin"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      )}
      {/* <div className="container mx-auto">
        <ImageUploadModal isOpen={isModalOpen} onClose={closeModal} />
      </div> */}
    </main>
  );
}
