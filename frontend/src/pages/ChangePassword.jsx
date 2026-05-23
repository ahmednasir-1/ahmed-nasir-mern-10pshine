import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/user.api";

export default function ChangePassword() {

    const { token } = useParams()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        setMessage('')
        setLoading(true)

        try {
            if (password != confirmPassword) {
                setError("Password dont match")
            }
            else {
                await resetPassword(token, password)
                setMessage('Password reset successfully!')

                //redirect to login page
                setTimeout(() => navigate('/'), 2000)

            }

        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong!")
        }
        finally{
            setLoading(false)
        }

    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-[#161922] to-primary flex items-center justify-center p-4 font-sans antialiased text-text-primary">
            <div className="bg-secondary w-full max-w-md p-10 border border-border shadow-card">

                <Link to="/" className="inline-flex underline items-center text-[10px] uppercase tracking-widest font-semibold text-text-secondary hover:text-accent transition-colors mb-6 group">
                    Return To Login
                </Link>

                {message && (
                    <p className="text-xs font-sans text-accent bg-secondary border border-border px-4 py-2.5 tracking-wide">
                        {message}
                    </p>
                )}
                {error && (
                    <p className="text-xs font-sans text-red-400 bg-secondary border border-red-900/30 px-4 py-2.5 tracking-wide">
                        {error}
                    </p>
                )}

                <div className="text-center mb-8">
                    <div className="font-sans text-xs font-bold uppercase tracking-widest text-text-secondary mb-4">Reset Password</div>
                    <p className="text-xs text-text-secondary mt-2">Enter and confirm your new password below to restore access.</p>
                </div>

                <form className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30"
                        />
                    </div>

                    <button
                        className="w-full py-3 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn cursor-pointer"
                        onClick={handleSubmit}
                        disabled={loading}
                        title="Reset Password"
                    >
                        {loading? 'Loading...' : 'Reset Password'}
                    </button>
                </form>

            </div>
        </div>
    );
}
