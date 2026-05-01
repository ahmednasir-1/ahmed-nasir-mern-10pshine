import React, { useState } from "react";
import { login } from "../api/auth.api";

function SignIn() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('')

    try {

      console.log('data', formData);

      const data = await login(
        formData.email,
        formData.password,
      )

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!")
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-(--color-bg)">

      <div className="bg-(--color-bg) rounded-2xl shadow-lg flex w-[800px] overflow-hidden">

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

          {/* error message */}
          {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}


          <form className="flex flex-col gap-4">

            <div className="mb-4">
              <label className="block text-(--color-heading)">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-(--color-heading)"
                value={formData.email}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-(--color-heading)">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-heading)"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <button onClick={handleSubmit}
              disabled={loading}
              className="bg-(--color-heading) text-white py-3 rounded-lg hover:bg-(--color-text) transition">
              {loading ? "loging in.." : "Login"}
            </button>
          </form>

          {/* <p className="text-sm text-center mt-4">
            <a href="#" className="text-(--color-primary) hover:underline">
              Forgot Password?
            </a>
          </p> */}
        </div>
      </div>

    </div>
  );
}

export default SignIn;