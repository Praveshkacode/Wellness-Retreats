import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Page from './components/Page/Page'
import Footer from './components/Footer/Footer'
import './App.css' 

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Page />
      <Footer />
    </div>
  )
}

export default App
