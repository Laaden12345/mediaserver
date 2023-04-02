import React from "react"
import { isRouteErrorResponse, useRouteError } from "react-router-dom"

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>
        <i>
          {isRouteErrorResponse(error)
            ? error.statusText
            : "Unknown error occurred"}
        </i>
      </p>
    </div>
  )
}
