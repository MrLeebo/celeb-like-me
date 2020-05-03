module.exports = {
  defaultUrlOptions: {
    host: "celeb-like-me.now.sh",
    protocol: "https",
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => config,
  webpackDevMiddleware: (config) => config,
}
