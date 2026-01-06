'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

interface WithholdingData {
  limit: {
    amount: number
    current: number
    remaining: number
    percentage: number
  }
  summary: {
    accountsSold: number
    withheld: number
    days: number
  }
  payPeriod: {
    start: string
    end: string
    label: string
  }
  transactions: Array<{
    id: string
    date: string
    accountsSold: number
    withheld: number
  }>
}

export default function WithholdingPage() {
  const [data, setData] = useState<WithholdingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithholding()
  }, [])

  const fetchWithholding = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/withholding')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch withholding:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MobileHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moxie-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
          <Link
            href="/commission"
            className="flex-1 px-4 py-2 text-center font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Commission
          </Link>
          <Link
            href="/withholding"
            className="flex-1 px-4 py-2 text-center font-semibold bg-moxie-primary text-white rounded-md"
          >
            Withholding
          </Link>
        </div>

        {/* Limit Progress Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Withholding Limit</h2>
            <span className="text-sm text-gray-500">{data?.payPeriod.label}</span>
          </div>

          <div className="mb-4">
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold text-orange-600">
                ${data?.limit.current.toLocaleString()}
              </span>
              <span className="text-lg font-semibold text-gray-500">
                / ${data?.limit.amount.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(data?.limit.percentage || 0, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600">
                {data?.limit.percentage}% of limit
              </span>
              <span className="text-sm font-medium text-green-600">
                ${data?.limit.remaining.toLocaleString()} remaining
              </span>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800">
              Once at ${data?.limit.amount.toLocaleString()}, no more withholdings will be applied to your commissions.
            </p>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Period Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {data?.summary.accountsSold}
              </p>
              <p className="text-xs text-gray-600 mt-1">Accounts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                ${data?.summary.withheld.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Withholding</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {data?.summary.days}
              </p>
              <p className="text-xs text-gray-600 mt-1">Days</p>
            </div>
          </div>
        </div>

        {/* Withholding History */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Withholding History</h3>
          </div>

          {/* Table Header */}
          <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600">
            <div className="col-span-4">Date</div>
            <div className="col-span-4 text-center">Accounts</div>
            <div className="col-span-4 text-right">Withheld</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {data?.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-4 py-4 grid grid-cols-12 gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </div>
                <div className="col-span-4 text-center font-semibold text-gray-900">
                  {transaction.accountsSold}
                </div>
                <div className="col-span-4 text-right font-semibold text-orange-600">
                  ${transaction.withheld.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
