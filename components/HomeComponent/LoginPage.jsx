"use client";
import AuthNav from "@/components/global/authNav/authNav";
import { fetchApi } from "@/utils/FetchApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    try {
      const response = await fetchApi("/auth/signInUser", "POST", {
        email,
        password,
      });
      if (response && response?.data?.user &&
        response?.token) {
        setShowError(false);
        localStorage.setItem("user", JSON.stringify(response?.data?.user));
        Cookies.set("token", response?.token, { expires: 7 });
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response structure");
      }
     
    } catch (error) {
      console.error(error);
      setShowError(true);
    }
    setLoading(false);
  };

  return (
    <main className="">
      <AuthNav />
      <section className="flex mx-auto p-5 shadow-md max-w-[412px] mt-[20vh]">
        <div className="">
          <div>
            <h3 className="text-2xl font-bold ">Login to your account!</h3>
            <p className="text-sm text-[#6B7280] pt-2">
              Lorem ipsum dolor sit amet consectetur. Risus enim scelerisque
              fermentum fermentum.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col space-y-4 mt-5 text-[#6B7280] "
          >
            <div className="flex flex-col space-y-1">
              <label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="Enter your email"
                className="border border-gray-300 rounded-md p-2 focus:outline-none "
              />
              <span
                className={`text-xs text-red-500 ${showError ? "block" : "hidden"
                  }`}
              >
                Invalid email address
              </span>
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
              <span
                className={`text-xs text-red-500 ${showError ? "block" : "hidden"
                  }`}
              >
                Invalid password
              </span>
            </div>
            <button
              type="submit"
              className="bg-[#000000] text-center text-white py-2 my-10 rounded-md"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <Link
            href="/authentication/forgot"
            className="text-[#000000] flex justify-center mt-5 text-sm"
          >
            Forgot password?
          </Link>
          <Link
            href="/authentication/register"
            className="text-[#000000] flex justify-center mt-5 text-sm"
          >
            Don&apos;t have an account? Register
          </Link>
        </div>
      </section>
    </main>
  );
}
