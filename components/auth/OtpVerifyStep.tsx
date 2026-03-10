'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-browser'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { ShieldCheck, MailCheck, RefreshCw } from 'lucide-react'

interface Props {
  email: string
  onVerified: () => void
}

export default function OtpVerifyStep({ email, onVerified }: Props) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)
  const [resending, setResending] = useState(false)

  async function handleVerify() {
    if (otp.length < 6) return
    setLoading(true)
    setError(null)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'signup',
    })

    setLoading(false)

    if (verifyError) {
      setError(verifyError.message)
      setOtp('')
    } else {
      onVerified()
    }
  }

  async function handleResend() {
    setResending(true)
    setError(null)
    await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 5000)
  }

  return (
    <div className="w-full max-w-[540px]">
      <div className="bg-white rounded-xl border-t-[3px] border-[#f59e0b] shadow-[0_4px_6px_rgba(12,31,74,0.04),0_10px_40px_rgba(12,31,74,0.10),0_30px_60px_rgba(12,31,74,0.06)] ring-1 ring-[#0c1f4a]/[0.05] px-8 sm:px-10 py-9">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-[#0c1f4a]/[0.06] flex items-center justify-center">
            <MailCheck size={28} className="text-[#0c1f4a]" />
          </div>
        </div>

        <div className="text-center mb-7">
          <h2 className="text-[1.5rem] font-black text-[#0c1f4a] tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-bold text-[#0c1f4a] mt-1">{email}</p>
        </div>

        {/* OTP input */}
        <div className="flex justify-center mb-6">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-11 h-12 text-lg font-bold rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0c1f4a] focus:ring-[#0c1f4a]/20"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <p className="mb-4 text-center text-sm text-rose-600 flex items-center justify-center gap-1.5">
            <span className="shrink-0 w-4 h-4 rounded-full bg-rose-500 text-white inline-flex items-center justify-center font-black text-[9px]">!</span>
            {error}
          </p>
        )}

        {resent && (
          <p className="mb-4 text-center text-sm text-emerald-600 flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} />
            New code sent!
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={otp.length < 6 || loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0c1f4a] to-[#163880] text-white text-[15px] font-bold tracking-wide hover:from-[#0f2860] hover:to-[#1a44a0] active:scale-[0.99] hover:scale-[1.005] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 shadow-[0_4px_20px_rgba(12,31,74,0.28)]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Verifying…
            </span>
          ) : (
            'Verify Email'
          )}
        </button>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Didn&rsquo;t receive a code?{' '}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#0c1f4a] font-semibold hover:text-[#f59e0b] transition-colors inline-flex items-center gap-1"
            >
              {resending ? (
                <><RefreshCw size={12} className="animate-spin" /> Sending…</>
              ) : (
                'Resend code'
              )}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
