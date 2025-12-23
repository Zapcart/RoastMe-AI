export const leaderboardStore = [];

export function addLeaderboardEntry(entry) {
  const exists = leaderboardStore.find((i) => i.id === entry.id);
  if (!exists) {
    leaderboardStore.push(entry);
  }
}

export function getLeaderboard() {
  return [...leaderboardStore].sort((a, b) => b.amount - a.amount);
}


