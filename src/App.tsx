import React from 'react';
import {Helmet, HelmetProvider} from "react-helmet-async";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Chatbot from "./Pages/Chatbot";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
      <>
          <HelmetProvider>
              <Helmet>
                  <title>LawLaboratory</title>
              </Helmet>
                <Navbar/>
              <BrowserRouter>
                  <Routes>
                      <Route path="/chatbot/:token" element={<Chatbot/>}/>
                  </Routes>
              </BrowserRouter>
          </HelmetProvider>
      </>
  )
}

export default App;