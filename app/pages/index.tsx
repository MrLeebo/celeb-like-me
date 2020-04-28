import { useQuery, Head } from "blitz"
import recent from "app/queries/recent"
import predict from "app/queries/predict"
import { useState } from "react"

export default function Home() {
  const [url, setUrl] = useState("https://avatars3.githubusercontent.com/u/8813276?v=4")
  const [results, setResults] = useState()
  const [error, setError] = useState(null)

  const [recents, { refetch }] = useQuery(recent)

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await predict({ data: { url: e.target.url.value } })
      refetch()
      setResults(res as any)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Head>
        <title>celeb-like-me</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <form id="main" onSubmit={handleSubmit} className="space-y-4">
        <div className="flex">
          <div className="flex-grow">
            {error && <span className="text-red-600">{error.message}</span>}

            <label htmlFor="url" className={classes.label}>
              Picture URL
            </label>

            <div className={classes.formGroup}>
              <input
                id="url"
                name="url"
                type="text"
                className={classes.input}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>
        </div>
        <button key="predict" className={`max-w-xs ${classes.button}`}>
          Predict
        </button>
      </form>

      <div className="flex justify-around">
        <div className="w-2/5">
          <img src={url} alt="Preview" className={classes.img} />
        </div>

        <div className="w-2/5">
          {results && (
            <>
              <PredictionResults data={results} />
            </>
          )}
        </div>
      </div>

      <div>
        <h2>Recent Searches</h2>
        {recents.map((recent) => (
          <div>
            <button
              className="underline hover:text-gray-500"
              onClick={() => {
                setUrl(recent.url)
                setResults(null)
              }}
            >
              {recent.url}
            </button>
          </div>
        ))}
      </div>

      <footer className="mt-8">
        <a href="https://github.com/MrLeebo/celeb-like-me" target="_blank" rel="noopener noreferrer">
          View Source Code
        </a>
        {" | "}
        <a
          href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Blitz.js
        </a>
      </footer>
    </div>
  )
}

const classes = {
  label: "block text-sm leading-5 font-medium text-gray-700",
  formGroup: "mt-1 relative border border-gray-300 rounded-md shadow-sm",
  input: "form-input block w-full pl-7 pr-12 sm:text-sm sm:leading-5",
  img: "rounded-md w-full object-cover",
  button:
    "w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10",
}

const PredictionResults = ({ data }) => {
  if (data.error) return data.error

  return (
    <div className="grid grid-col-3">
      {data.result.matches.map((match) => (
        <div className="capitalize">
          {match.name} ({(match.value * 100).toFixed(2)}%)
        </div>
      ))}
    </div>
  )
}
