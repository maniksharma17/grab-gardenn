'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_API}/api/users/reset-password/${params.token}`, { password })
      toast.success("Password reset successful. Please login.")
      router.push('/login')
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md min-h-screen mx-auto mt-20 px-6 py-10 bg-white shadow-md rounded-xl border">
      <h1 className="text-2xl font-semibold mb-4 text-center">Reset Password</h1>
      <Input
        type="password"
        placeholder="New Password"
        className="mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        className="mb-6"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button onClick={handleReset} className="w-full" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </div>
  )
}
