import "app/styles/app.css"
import { Suspense } from "react"

export default function App({ Component, pageProps }) {
  return (
    <Suspense fallback="Loading...">
      <Component {...pageProps} />
    </Suspense>
  )
}
