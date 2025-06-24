"use client";
import AuthNav from "@/components/global/authNav/authNav";
import { fetchApi } from "@/utils/FetchApi";
import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Register() {
  const [showError, setShowError] = useState(false);
  const [setError, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const handleRegister = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    let token = urlParams.get("token");
    if (token && token.includes("?token=")) {
      token = token.split("?token=").pop();
    }
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      password: formData.get("password"),
      username: formData.get("username"),
      phone: formData.get("phone"),
      token: token,
    };
    setLoading(true);
    console.log("register data", data);

    try {
      const endpoint = `/admin/register-invited-admin?token=${token}`;

      const response = await fetchApi(endpoint, "POST", {
        ...data,
      });

      if (response) {
        // console.log("register response", response);
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message);
      setShowError(true);
    }
    setLoading(false);
  };

  return (
    <main className="">
      <AuthNav />
      <section className="flex mx-auto p-5 shadow-lg max-w-[412px] mt-[20vh]">
        <div className="">
          <div>
            <h3 className="text-2xl font-bold ">Register to your account!</h3>
            <p className="text-sm text-[#6B7280] pt-2">
              Lorem ipsum dolor sit amet consectetur. Risus enim scelerisque
              fermentum fermentum.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="flex flex-col space-y-4 mt-5 text-[#6B7280] "
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="name" className="text-sm font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Enter your name"
                className="border border-gray-300 rounded-md p-2 focus:outline-none "
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="password" className="text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter your password"
                className="border border-gray-300 rounded-md p-2 focus:outline-none "
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="username" className="text-sm font-semibold">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Enter your username"
                className="border border-gray-300 rounded-md p-2 focus:outline-none "
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label htmlFor="phone" className="text-sm font-semibold">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                required
                placeholder="Enter your phone number"
                className="border border-gray-300 rounded-md p-2 focus:outline-none "
              />
            </div>
            <span
              className={`text-xs text-red-500 ${
                showError ? "block" : "hidden"
              }`}
            >
              {setError ? setError : "something went wrong please try again!"}
            </span>
            <button
              type="submit"
              className="bg-[#000000] text-center text-white py-2 my-10 rounded-md"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </form>
          <Link
            href="/"
            className="text-[#000000] flex justify-center mt-5 text-sm"
          >
            Already have an account? Login
          </Link>
        </div>
      </section>
    </main>
  );
}
