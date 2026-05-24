import { useEffect, useState } from "react"
import { changePassword, getProfile, updateProfile } from "../api/user.api"

export default function UserProfile() {

    const [name, setName] = useState('')
    const [user, setUser] = useState(null)
    const [currPassword, setCurrPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [preview, setPreview] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        const fetchProfile = async () => {

            try {
                const data = await getProfile()
                setUser(data)
                setName(data.name)
            } catch (error) {
                console.log(error)

            }
            finally{
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError('')
        setMessage('')

        try {
            const res = await updateProfile(name)

            localStorage.setItem('user', JSON.stringify(
                {
                    _id: res._id,
                    name: res.name,
                    email: res.email
                }
            ))

            setUser(res)
            setMessage("Profile Updated Successfully")
        }
        catch {
            setError("something went wrong")
        }
        finally {
            setLoading(false)
        }

    }


    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError('')
        setMessage('')
        
        if (newPassword != confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }
        
        setLoading(true)
        try {
           
                await changePassword(currPassword, newPassword)
                setCurrPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setMessage("Password Changed Successfully")
            
        }
        catch {
            setError("something went wrong - password")
        }
        finally {
            setLoading(false)
        }

    }

    if (!user) return <p className="p-6">Loading...</p>

    return (<div className="min-h-screen bg-primary text-text-primary font-sans antialiased p-6 md:p-12 selection:bg-accent selection:text-primary">
        <div className="max-w-4xl mx-auto space-y-10">


            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-border gap-4">
                <div className="flex items-center space-x-6">

                    <div className="w-20 h-20 bg-secondary border border-border flex items-center justify-center font-serif text-3xl font-semibold text-accent select-none shadow-card">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "W"}
                    </div>
                    <div>
                        <h1 className="font-serif font-medium text-3xl tracking-tight text-text-primary">
                            {user?.name || "User"}
                        </h1>

                    </div>
                </div>

                <span className="px-3 py-1 bg-secondary border border-border text-text-secondary text-[10px] uppercase tracking-widest font-semibold select-none">
                    Verified Account
                </span>
            </div>


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

            {/* Section 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h3 className="font-serif text-lg font-medium text-text-primary tracking-tight">
                        Update your Profile
                    </h3>

                </div>

                {/* Form Content Block */}
                <div className="md:col-span-2 space-y-5 bg-secondary p-8 border border-border shadow-card">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-secondary mb-1.5">
                            Full Profile Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary outline-none focus:border-accent transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-secondary mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary outline-none focus:border-accent transition-all duration-200"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleUpdateProfile}
                            disabled={loading}
                            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn cursor-pointer rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Section 2*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-border">
                <div className="md:col-span-1">
                    <h3 className="font-serif text-lg font-medium text-text-primary tracking-tight">
                        Change your Password
                    </h3>

                </div>

                <div className="md:col-span-2 bg-secondary p-8 border border-border shadow-card space-y-5">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-secondary mb-1.5">
                            Current Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={currPassword}
                            onChange={(e) => setCurrPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary outline-none focus:border-accent transition-all duration-200 placeholder:text-text-secondary/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-secondary mb-1.5">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary outline-none focus:border-accent transition-all duration-200 placeholder:text-text-secondary/20"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-semibold text-text-secondary mb-1.5">
                                Re-type New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-primary border border-border text-sm text-text-primary outline-none focus:border-accent transition-all duration-200 placeholder:text-text-secondary/20"
                            />
                        </div>
                    </div>


                    <div className="flex justify-end pt-2">
                        <button
                            onClick={handleChangePassword}
                            disabled={loading}
                            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-primary text-xs uppercase tracking-widest font-semibold transition-all shadow-btn cursor-pointer rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading ? "Changing Password..." : "Change Password"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
    );
}

