import React from 'react';
import {
  ChakraProvider,
  theme
} from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
// import About from "./About";
import Profile from "./ProfilePage";
import Registration from "./Registration";

export default function App() {
  return (
    <ChakraProvider theme={theme}>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProfilePage" element={<Profile />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  );
}