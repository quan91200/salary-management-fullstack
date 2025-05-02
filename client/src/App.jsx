import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './routes/routes.js'
import PrivateRoute from './routes/PrivateRoute'
import Layout from './layouts/Layout'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}

        {privateRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <PrivateRoute>
                {route.layout ? (
                  <Layout>
                    <route.component />
                  </Layout>
                ) : (
                  <route.component />
                )}
              </PrivateRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  )
}

export default App