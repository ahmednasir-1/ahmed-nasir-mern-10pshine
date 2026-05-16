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
        formData.password,

      )

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#161922] to-primary flex items-center justify-center p-4 font-sans antialiased text-text-primary">

      <div className="bg-secondary w-full max-w-md p-10 border border-border shadow-card">

        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-text-primary">Welcome Back</h2>
          <p className="text-xs text-text-secondary mt-2">Create your account.</p>
        </div>

        {error && (<p className="text-red-500 text-sm mb-4">{error}</p>)}

        <form className="space-y-5">

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">Full Name</label>
            <input
              type="text" autoComplete="on"
              name="name"
              placeholder="Jane Doe"
              className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">Email</label>
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
            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create secure password"
              className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
              value={formData.password}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <button
            className="w-full py-3 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn mt-2 cursor-pointer"
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? 'Signing Up...' : 'Create an Account'}
          </button>

        </form>

        <div className="text-center mt-6 pt-6 border-t border-border">
          <p className="text-xs text-text-secondary">
            Already have an account?{' '}
            <Link to="/" className="text-text-primary font-medium underline underline-offset-4 hover:text-accent transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>

  );
}

export default SignUp;