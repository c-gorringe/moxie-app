'use client'

import { useState, useEffect } from 'react'
import MobileHeader from '@/components/layout/MobileHeader'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Account
    name: '',
    email: '',
    phone: '',

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    dailyDigest: false,
    weeklyReport: true,

    // Display
    theme: 'light',
    language: 'en',

    // Privacy
    showInLeaderboard: true,
    shareStats: true,
  })

  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<'account' | 'notifications' | 'display' | 'privacy'>('account')

  // Fetch current user's data
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('currentUserId')
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/users/${userId}`)
        const data = await response.json()

        if (data.user) {
          setSettings(prev => ({
            ...prev,
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
          }))
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  const handleSave = () => {
    // TODO: Save to API
    alert('Settings saved! (This would save to the API)')
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
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        {/* Section Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveSection('account')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                activeSection === 'account'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Account
            </button>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                activeSection === 'notifications'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveSection('display')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                activeSection === 'display'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Display
            </button>
            <button
              onClick={() => setActiveSection('privacy')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors ${
                activeSection === 'privacy'
                  ? 'text-moxie-primary border-b-2 border-moxie-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Privacy
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                  />
                </div>

                <div className="pt-4">
                  <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Danger Zone</h3>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Deactivate Account
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.emailNotifications ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Receive text messages for updates</p>
                    </div>
                    <button
                      onClick={() => handleToggle('smsNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.smsNotifications ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Push Notifications</p>
                      <p className="text-sm text-gray-500">Receive push notifications</p>
                    </div>
                    <button
                      onClick={() => handleToggle('pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.pushNotifications ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Daily Digest</p>
                      <p className="text-sm text-gray-500">Daily summary at 8 AM</p>
                    </div>
                    <button
                      onClick={() => handleToggle('dailyDigest')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.dailyDigest ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.dailyDigest ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Weekly Report</p>
                      <p className="text-sm text-gray-500">Weekly summary every Monday</p>
                    </div>
                    <button
                      onClick={() => handleToggle('weeklyReport')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.weeklyReport ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.weeklyReport ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display Section */}
            {activeSection === 'display' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Display Preferences</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moxie-primary focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800">
                    Theme and language changes will be applied immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Privacy Settings</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Show in Leaderboard</p>
                      <p className="text-sm text-gray-500">Display my stats on the team leaderboard</p>
                    </div>
                    <button
                      onClick={() => handleToggle('showInLeaderboard')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.showInLeaderboard ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.showInLeaderboard ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">Share Stats</p>
                      <p className="text-sm text-gray-500">Allow others to view my profile stats</p>
                    </div>
                    <button
                      onClick={() => handleToggle('shareStats')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.shareStats ? 'bg-moxie-primary' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.shareStats ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Data & Privacy</h3>
                  <div className="space-y-2">
                    <button className="text-sm text-moxie-primary hover:text-moxie-secondary font-medium block">
                      Download My Data
                    </button>
                    <button className="text-sm text-moxie-primary hover:text-moxie-secondary font-medium block">
                      Privacy Policy
                    </button>
                    <button className="text-sm text-moxie-primary hover:text-moxie-secondary font-medium block">
                      Terms of Service
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-moxie-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 py-4">
          <p>MOXIE Sales Tracker</p>
          <p className="mt-1">Version 1.0.0</p>
        </div>
      </main>
    </div>
  )
}
