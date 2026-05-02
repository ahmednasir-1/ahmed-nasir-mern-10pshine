import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../api/auth.api";

function SignUp() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {

      console.log(formData);

      // send data POST request
      const data = await registerAPI(
        formData.name,
        formData.email,
        formData.password
      )

      // save token to local storage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }))

      // redirect to sign in page
      navigate('/');

    } catch (error) {
     setError(error.response?.data?.message || "Something went wrong")

    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-[var(--color-bg)]">

      <div className="bg-[var(--color-bg)] rounded-2xl shadow-lg w-[800px] overflow-hidden flex justify-center">


        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[var(--color-heading)]">
            Sign Up
          </h2>


          {/* error message */}
          {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}


          <form className="flex flex-col gap-4">

            <div className="mb-4">
              <label className="block text-(--color-heading)">Name</label>
              <input
                type="text" autoComplete="on"
                name="name"
                placeholder="Enter your name"
                className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-(--color-heading)"
                value={formData.name}
                onChange={(e) => handleChange(e)}

              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--color-heading)]">Email</label>
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
              <label className="block text-[var(--color-heading)]">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-(--color-heading)"
                value={formData.password}
                onChange={(e) => handleChange(e)}
              />
            </div>

            <button className="bg-(--color-heading) text-white py-3 rounded-lg hover:bg-(--color-text) transition"
              onClick={handleSubmit}
              disabled={loading} >
              {loading ? 'Signing Up...' : 'Create an Account'}
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