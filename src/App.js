import React from 'react';
import {
  ChakraProvider,
  theme,
  Spinner,
} from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, connect } from "react-redux";

import Home from "./Home";
// import About from "./About";
import Profile from "./ProfilePage";
import Registration from "./Registration";
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

export default function App() {
  return (
    <Provider store = {store}>
      <PersistGate loading={<Spinner size = "xl"/>} persistor={persistor}>
    <ChakraProvider theme={theme}>
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ProfilePage" element={<Profile />} />
        <Route path="/Registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
    </PersistGate>
    </Provider>
  );
}