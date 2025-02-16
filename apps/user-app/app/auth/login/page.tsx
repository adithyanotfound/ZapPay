'use client'
import React, { useState } from 'react'
import { Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await signIn('credentials', {
            redirect: false,
            phone,
            password
        })

        setLoading(false)

        if (result?.ok) {
            toast.success("Signed in successfully");
            router.push('/dashboard')
        } else {
            toast.error(result?.error || "Authentication failed");
        }
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="hidden md:flex bg-gray-200 p-12 flex-col justify-between">
                <div className="flex items-center space-x-2">
                    <Command className="h-6 w-6" />
                    <span className="text-xl font-semibold">PayTM</span>
                </div>
                <div className="space-y-2">
                    <blockquote className="text-2xl font-medium">
                        "This app has made transactions seamless and efficient for everyone."
                    </blockquote>
                    <div className="text-gray-600 font-medium">CEO | Acme.Inc</div>
                </div>
            </div>
            <div className="bg-gray-50 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-sm space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Sign in to your account
                        </h1>
                        <p className="text-sm text-gray-500">
                            Enter your details below to login
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full"
                            required
                        />
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in with Phone"}
                        </Button>
                    </form>

                    <div className="space-y-4">
                        <p className="text-xs text-center text-gray-500">
                            By clicking continue, you agree to our {" "}
                            <a href="#" className="underline underline-offset-4 hover:text-gray-900">
                                Terms of Service
                            </a>{" "}
                            and {" "}
                            <a href="#" className="underline underline-offset-4 hover:text-gray-900">
                                Privacy Policy
                            </a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}