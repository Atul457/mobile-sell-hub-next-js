/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    S3_CDN_ENDPOINT: process.env.S3_CDN_ENDPOINT
  },
  basePath: process.env.BASEPATH,

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
