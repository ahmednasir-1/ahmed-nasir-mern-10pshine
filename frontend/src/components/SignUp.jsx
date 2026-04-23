import React from "react";
import { Link } from "react-router-dom";

function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-[var(--color-bg)]">
      
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-lg w-[800px] overflow-hidden flex justify-center">

        {/* Right Side */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-heading)]">
            Sign Up
          </h2>


          <form className="flex flex-col gap-4">

             <input
              type="text" autoComplete="on"
              placeholder="Enter Name"
              className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-(--color-heading)"
            />

            <input
              type="email"
              placeholder="Enter email"
              className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-(--color-heading)"
            />

            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-heading)"
            />

            <button className="bg-(--color-heading) text-white py-3 rounded-lg hover:bg-(--color-text) transition">
              Create Account
            </button>
          </form>

          <div className="text-sm text-center mt-4">
            <Link to="/" className="text-(--color-primary) hover:underline">
              Already have an account?
            </Link>

          </div>
        </div>
      </div>

    </div>
  );
}

export default SignUp;