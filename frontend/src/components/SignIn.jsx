import React, { useState } from "react";
import { login } from "../api/auth.api";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();
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

      // send data POST request
      const data = await login(
        formData.email,
        formData.password,
      )

      // save in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email
      }))

      // redirect to dashboard
      navigate('/dashboard');

    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!")
    }
    finally {
      setLoading(false);
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#161922] to-primary flex items-center justify-center p-4 font-sans antialiased text-text-primary">

      <div className="bg-secondary w-full max-w-md p-10 border border-border shadow-card">

        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-text-primary">Welcome Back</h2>
        </div>

        {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}

        <form className="space-y-5">

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
              value={formData.email}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary">Password</label>

              <Link to="/forgot-password" className="text-[10px] uppercase tracking-wider text-text-secondary hover:text-accent transition-colors">Forgot Password?</Link>

            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn mt-2 cursor-pointer"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>



        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-xs text-text-secondary">
            Don't have a account?
            <Link to="/signup" className="text-text-primary font-medium underline underline-offset-4 hover:text-accent transition-colors">
              Sign Up here
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default SignIn;