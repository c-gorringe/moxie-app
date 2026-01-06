'use client'

import { useEffect, useState } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'
import Link from 'next/link'

interface CommissionData {
  summary: {
    accountsSold: number
    earned: number
    paid: number
    withheld: number
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
    earned: number
    paid: number
    withheld: number
    isPaid: boolean
  }>
}

export default function CommissionPage() {
  const [data, setData] = useState<CommissionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommission()
  }, [])

  const fetchCommission = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/commission')
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch commission:', error)
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
            className="flex-1 px-4 py-2 text-center font-semibold bg-moxie-primary text-white rounded-md"
          >
            Commission
          </Link>
          <Link
            href="/withholding"
            className="flex-1 px-4 py-2 text-center font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Withholding
          </Link>
        </div>

        {/* Summary - This Pay Period */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <span className="text-sm text-gray-500">{data?.payPeriod.label}</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {data?.summary.accountsSold}
              </p>
              <p className="text-xs text-gray-600 mt-1">Accounts Sold</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${data?.summary.earned.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ${data?.summary.paid.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Paid</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
          </div>

          {/* Table Header */}
          <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 grid grid-cols-12 gap-2 text-xs font-semibold text-gray-600">
            <div className="col-span-3">Date</div>
            <div className="col-span-3 text-center">Accounts</div>
            <div className="col-span-3 text-right">Earned</div>
            <div className="col-span-3 text-right">Paid</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {data?.transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-4 py-4 grid grid-cols-12 gap-2 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-3 text-sm text-gray-900">
                  {formatDate(transaction.date)}
                </div>
                <div className="col-span-3 text-center font-semibold text-gray-900">
                  {transaction.accountsSold}
                </div>
                <div className="col-span-3 text-right font-semibold text-green-600">
                  ${transaction.earned.toLocaleString()}
                </div>
                <div className="col-span-3 text-right font-semibold text-blue-600">
                  ${transaction.paid.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Period Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {data?.summary.accountsSold}
              </p>
              <p className="text-xs text-gray-600 mt-1">Accounts Sold</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">
                ${data?.summary.withheld.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Withholding</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">
                {data?.transactions.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Days</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
