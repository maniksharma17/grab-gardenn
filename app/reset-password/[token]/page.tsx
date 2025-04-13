'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleReset = async () => {
    if (password !== confirmPassword) {
      toast({ title: 'Passwords do not match', variant: 'destructive' })
      return
    }

    try {
      setLoading(true)
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/reset-password/${params.token}`, { password })
      toast({ title: 'Password reset successful. Please login.' })
      router.replace('/auth')
    } catch (err: any) {
      toast({ title: err?.response?.data?.message || 'Something went wrong', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-screen flex justify-center items-center">
      <div className="md:w-1/3 md:h-1/3 mx-auto mt-20 px-6 py-10 bg-white shadow-md rounded-md border">
        <h1 className="text-2xl font-semibold mb-4 text-center">Reset Password</h1>

        {/* New Password Input */}
        <div className="relative mb-4">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password Input */}
        <div className="relative mb-6">
          <Input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button onClick={handleReset} className="w-full" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </div>
    </main>
  )
}
