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

interface Sale {
  id: string
  date: string
  revenue: number
  accountsSold: number
  isCanceled: boolean
  isInstall: boolean
}

interface SalesData {
  sales: Sale[]
  total: {
    count: number
    revenue: number
  }
}

export default function CommissionPage() {
  const [data, setData] = useState<CommissionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loadingSales, setLoadingSales] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState('pay-period')

  useEffect(() => {
    const userId = localStorage.getItem('currentUserId')
    setCurrentUserId(userId)
  }, [])

  useEffect(() => {
    fetchCommission()
  }, [dateFilter])

  const fetchCommission = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        period: dateFilter,
      })
      const response = await fetch(`/api/commission?${params}`)
      const data = await response.json()
      setData(data)
    } catch (error) {
      console.error('Failed to fetch commission:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSalesForDate = async (date: string) => {
    if (!currentUserId) return

    setLoadingSales(true)
    try {
      const response = await fetch(
        `/api/commission/sales?userId=${currentUserId}&date=${date}`
      )
      const data = await response.json()
      setSalesData(data)
    } catch (error) {
      console.error('Failed to fetch sales:', error)
    } finally {
      setLoadingSales(false)
    }
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
    fetchSalesForDate(date)
  }

  const closeModal = () => {
    setSelectedDate(null)
    setSalesData(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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

        {/* Date Filter */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-moxie-primary"
          >
            <option value="pay-period">This Pay Period</option>
            <option value="prev-pay-period">Previous Pay Period</option>
            <option value="month">Month</option>
            <option value="quarter">Quarter</option>
            <option value="year">Year</option>
          </select>
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
                onClick={() => handleDateClick(transaction.date)}
                className="px-4 py-4 grid grid-cols-12 gap-2 hover:bg-blue-50 transition-colors cursor-pointer"
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

      {/* Sales Detail Modal */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Details
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              {loadingSales ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moxie-primary"></div>
                </div>
              ) : salesData ? (
                <div className="p-6 space-y-4">
                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {salesData.total.count}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${salesData.total.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Sales List */}
                  <div className="space-y-3">
                    {salesData.sales.map((sale, index) => (
                      <div
                        key={sale.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              Sale #{index + 1}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(sale.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ${sale.revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Revenue</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-600">Accounts:</span>
                            <span className="font-semibold text-gray-900">
                              {sale.accountsSold}
                            </span>
                          </div>
                          {sale.isInstall && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Install
                            </span>
                          )}
                          {sale.isCanceled && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                              Canceled
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {salesData.sales.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">No sales found for this date</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
