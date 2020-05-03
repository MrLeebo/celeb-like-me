import { useState } from "react"
import { useQuery, Head } from "blitz"
import recent from "app/queries/recent"
import predict from "app/queries/predict"
import lookup from "app/queries/lookup"

export default function Home() {
  const [image, setImage] = useState<any>()
  const [results, setResults] = useState()
  const [error, setError] = useState(null)

  const [recents, { refetch }] = useQuery(recent)

  async function imageChanged(newImg) {
    setResults(null)
    const res = await predict({ where: { id: newImg.id } })
    setResults(res as any)
    refetch()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await lookup({ username: e.target.username.value })
      setImage(res as any)
      imageChanged(res)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto flex flex-col justify-between">
      <Head>
        <title>celeb-like-me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <form id="main" onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div className="flex">
            <div className="flex-grow">
              {error && <span className="text-red-600">{error.message}</span>}

              <label htmlFor="username" className="block text-sm leading-5 font-medium text-gray-700">
                GitHub Username
              </label>

              <div className="mt-1 relative border border-gray-300 rounded shadow-md overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm sm:leading-5">@</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="form-input block w-full pl-8 pr-12 sm:text-sm sm:leading-5"
                  placeholder="Your GitHub Username"
                  autoComplete="none"
                  data-lpignore="true"
                  required
                />
                <div>
                  <button
                    key="lookup"
                    className="absolute px-1 right-0 top-0 sm:text-sm sm:leading-5 border border-transparent text-gray-800 hover:bg-gray-300"
                  >
                    Lookup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-around">
          <div className="w-2/5">
            {image && <img src={image.url} alt="Preview" className="rounded-md w-full object-cover" />}
          </div>

          <div className="w-2/5">{results && <PredictionResults data={results} />}</div>
        </div>
      </div>

      <div>
        <div>
          <h2>Recent Searches</h2>
          <div className="flex flex-wrap">
            {recents.map((recent) => (
              <div key={recent.id} className="m-2">
                <button
                  className="underline hover:text-gray-500"
                  onClick={() => {
                    setImage(recent)
                    imageChanged(recent)
                  }}
                >
                  {recent.username || recent.url}
                </button>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-8">
          <a
            href="https://github.com/MrLeebo/celeb-like-me"
            className="hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Source Code
          </a>
          {" | "}
          <a
            href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            className="hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Blitz.js
          </a>
        </footer>
      </div>
    </div>
  )
}

const PredictionResults = ({ data }) => {
  if (data.error) return data.error

  return (
    <>
      {data.result.matches.map((match) => (
        <div key={match.name}>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(match.name)}`}
            className="capitalize underline hover:text-gray-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {match.name} ({(match.value * 100).toFixed(2)}%)
          </a>
        </div>
      ))}
    </>
  )
}
