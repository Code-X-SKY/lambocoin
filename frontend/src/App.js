import './App.css';
import React, { components } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import config from './config/config'
// import Header from './directives/header'
// import Footer from './directives/footer'
import Home from './component/home'



function App() {
  return (
    <BrowserRouter>
     
     <Routes>
          
        {/* <Route path={`${config.baseUrl}`} exact component={home} /> */}

        <Route path={`${config.baseUrl}`} element={<Home />} />
       

        </Routes>
      
    </BrowserRouter>
  );
}

export default App;




