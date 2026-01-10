// Milestone detection utilities for watchlist notifications

export interface Milestone {
  type: 'top_10' | 'top_5' | 'top_1' | 'big_day' | 'streak'
  message: string
  userId: string
  userName: string
}

/**
 * Check if a user has achieved any milestones based on their stats
 * This can be expanded to track more complex achievements
 */
export function detectMilestones(
  userId: string,
  userName: string,
  stats: {
    rank?: number
    todaySales?: number
    streak?: number
  }
): Milestone[] {
  const milestones: Milestone[] = []

  // Top rankings
  if (stats.rank !== undefined) {
    if (stats.rank === 1) {
      milestones.push({
        type: 'top_1',
        message: `🏆 ${userName} is now #1 on the leaderboard!`,
        userId,
        userName,
      })
    } else if (stats.rank <= 5) {
      milestones.push({
        type: 'top_5',
        message: `🌟 ${userName} broke into the Top 5!`,
        userId,
        userName,
      })
    } else if (stats.rank <= 10) {
      milestones.push({
        type: 'top_10',
        message: `⭐ ${userName} is now in the Top 10!`,
        userId,
        userName,
      })
    }
  }

  // Big sales day (10+ sales)
  if (stats.todaySales !== undefined && stats.todaySales >= 10) {
    milestones.push({
      type: 'big_day',
      message: `🎉 ${userName} just hit ${stats.todaySales} sales today!`,
      userId,
      userName,
    })
  }

  // Winning streak (5+ days)
  if (stats.streak !== undefined && stats.streak >= 5) {
    milestones.push({
      type: 'streak',
      message: `🔥 ${userName} is on a ${stats.streak}-day winning streak!`,
      userId,
      userName,
    })
  }

  return milestones
}

/**
 * Get milestone badge count for navigation
 * Returns the number of watched users who have achieved milestones today
 */
export async function getMilestoneBadgeCount(userId: string): Promise<number> {
  try {
    // This would fetch from an API endpoint that tracks daily milestones
    // For now, return 0 as placeholder
    // TODO: Implement milestone tracking API
    return 0
  } catch (error) {
    console.error('Failed to get milestone count:', error)
    return 0
  }
}
