let userConfig = null
try {
  const importedConfig = await import('./v0-user-next.config')
  userConfig = importedConfig.default || importedConfig
} catch (e) {
  // ignore error
  userConfig = null
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  experimental: {
    // Temporarily disabled experimental features to debug path issues
    // webpackBuildWorker: true,
    // parallelServerBuildTraces: true,
    // parallelServerCompiles: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig || typeof userConfig !== 'object') {
    return
  }

  for (const key in userConfig) {
    if (userConfig.hasOwnProperty(key) && userConfig[key] !== undefined) {
      if (
        typeof nextConfig[key] === 'object' &&
        !Array.isArray(nextConfig[key]) &&
        nextConfig[key] !== null &&
        typeof userConfig[key] === 'object' &&
        !Array.isArray(userConfig[key]) &&
        userConfig[key] !== null
      ) {
        nextConfig[key] = {
          ...nextConfig[key],
          ...userConfig[key],
        }
      } else {
        nextConfig[key] = userConfig[key]
      }
    }
  }
}

export default nextConfig
