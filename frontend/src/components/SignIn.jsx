import React from "react";

function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-(--color-bg)]">
      
      <div className="bg-(--color-bg)] rounded-2xl shadow-lg flex w-[800px] overflow-hidden">
        
        {/* Left Side */}
        <div className="w-1/2 bg-(--color-surface) text-(--color-heading) flex flex-col justify-center items-center p-8">
          <h1 className="text-3xl font-bold mb-4">Notes App</h1>
          <p className="text-center text-sm opacity-80 text-(--color-text)">
            Make your notes your strength 
          </p>
        </div>

        {/* Right Side */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-(--color-heading)">
            Sign In
          </h2>

          <form className="flex flex-col gap-4">
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
              Login
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            <a href="#" className="text-(--color-primary) hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}

export default SignIn;