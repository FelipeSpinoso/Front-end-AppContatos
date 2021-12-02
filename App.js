import React from 'react'
import Navigation from './src/router'
import ThemeProvider from './src/themes/ThemeProvider'

export default function App(){
  return(
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  )
}