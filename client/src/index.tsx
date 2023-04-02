import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { store } from "./rtk/store"
import "./index.scss"
import Home from "./views/Home"
import SeriesView from "./views/SeriesView"

const root = createRoot(document.getElementById("root"))

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/series/:seriesId" element={<SeriesView />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
