function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8
  const toRad = (deg) => deg * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function withDistance(facts, userLat, userLng) {
  return facts.map((f) => ({
    ...f,
    distanceMiles: haversineDistance(userLat, userLng, f.lat, f.lng),
  }))
}

export function findLocalFacts(allFacts, userLat, userLng) {
  const localFacts    = allFacts.filter((f) => !f.isNational)
  const nationalFacts = allFacts.filter((f) => f.isNational)
  const withDist      = withDistance(localFacts, userLat, userLng)

  const RADII = [
    { miles: 5,  label: (area) => `Within 5 miles of ${area}` },
    { miles: 10, label: (area) => `${area} and surrounds` },
    { miles: 20, label: (area) => `${area} region` },
  ]

  for (const { miles, label } of RADII) {
    const matched = withDist.filter((f) => f.distanceMiles <= miles)
    if (matched.length >= 5) return { facts: matched, radiusLabel: label }
  }

  if (nationalFacts.length > 0) {
    return { facts: withDistance(nationalFacts, userLat, userLng), radiusLabel: () => 'UK Discoveries' }
  }

  const all = withDist.sort((a, b) => a.distanceMiles - b.distanceMiles)
  return { facts: all, radiusLabel: (area) => `${area} and surrounds` }
}

export function filterByCategory(facts, category) {
  if (!category || category === 'All') return facts
  return facts.filter((f) => f.category === category)
}

export function sortByDistance(facts) {
  return [...facts].sort((a, b) => (a.distanceMiles ?? 0) - (b.distanceMiles ?? 0))
}
