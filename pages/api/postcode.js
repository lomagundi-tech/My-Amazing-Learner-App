export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { postcode } = req.body

  if (!postcode || typeof postcode !== 'string') {
    return res.status(400).json({ error: 'Postcode is required' })
  }

  const normalised = postcode.replace(/\s/g, '').toUpperCase()
  const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/

  if (!UK_POSTCODE_REGEX.test(normalised)) {
    return res.status(422).json({ error: 'Please enter a valid UK postcode (e.g. PO12 1LE)' })
  }

  try {
    const apiRes = await fetch(`https://api.postcodes.io/postcodes/${normalised}`)
    const data   = await apiRes.json()

    if (!apiRes.ok || data.status !== 200) {
      return res.status(422).json({ error: 'Please enter a valid UK postcode (e.g. PO12 1LE)' })
    }

    const { latitude, longitude, admin_district } = data.result

    return res.status(200).json({
      lat:      latitude,
      lng:      longitude,
      areaName: admin_district || 'Your Area',
    })
  } catch {
    return res.status(503).json({ error: 'Could not look up your postcode. Please try again.' })
  }
}
