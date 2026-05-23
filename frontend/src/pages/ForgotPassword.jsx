import { useState } from "react";
import { forgotPassword } from "../api/user.api.js";
import { Link } from "react-router-dom";
import { RiResetRightFill } from "react-icons/ri";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('')
        
        if (!email || !email.includes("@")) {
            setError("Email is required");
            return;
        }
        setLoading(true)
        try{
    
            await forgotPassword(email)
            setSubmitted(true);

        }
        catch(error){
            setError(error.response?.data?.message || 'Something went wrong')
        }
        finally{
            setLoading(false)
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary via-[#161922] to-primary flex items-center justify-center p-4 font-sans antialiased">
                <div className="bg-secondary w-full max-w-md p-10 border border-border shadow-card text-center">

                    
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-text-primary mb-2">
                        Email Sent
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed mb-6">
                        A recovery link has been sent to{" "}
                        <span className="text-accent font-semibold">{email}</span>.
                        <br /><br />
                        Check your inbox and follow the instructions. The link expires in 1 hour.
                    </p>

                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-[10px] flex gap-3 items-center justify-items-center center uppercase tracking-widest font-semibold text-text-secondary hover:text-accent transition-colors"
                    >
                    <RiResetRightFill />
                    Resend Link
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary via-[#161922] to-primary flex items-center justify-center p-4 font-sans antialiased text-text-primary">
            <div className="bg-secondary w-full max-w-md p-10 border border-border shadow-card">

                <Link href="/" className="inline-flex underline items-center text-[10px] uppercase tracking-widest font-semibold text-text-secondary hover:text-accent transition-colors mb-6 group">
                    Return To Login
                </Link>

                <div className="text-center mb-8">
                    <h2 className="font-serif text-3xl font-medium tracking-tight text-text-primary">Forgot Password</h2>
                    <p className="text-xs text-text-secondary mt-2">
                        Provide your email address below to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-primary mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(false); }}
                            placeholder="name@domain.com"
                            className={`w-full px-4 py-2.5 bg-primary border text-sm text-text-primary rounded-none focus:outline-none focus:border-accent transition-colors placeholder:text-text-secondary/30 ${
                                error ? "border-red-500/60" : "border-border"
                            }`}
                        />
                        {error && (
                            <p className="text-[10px] text-red-400 mt-1.5 uppercase tracking-widest">
                                Enter a valid email address
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "Transmitting..." : "Send Recovery Link"}
                    </button>
                </form>

            </div>
        </div>
    );
}