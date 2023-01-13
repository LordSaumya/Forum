//Imports
import React from 'react';
import {
  ChakraProvider,
  theme,
  Spinner,
} from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./Home";
import Profile from "./ProfilePage";
import Registration from "./Registration";
import Thread from "./Thread";
import EditThread from './EditThread.js';
import EditComment from './EditComment.js';
import ModDashboard from './ModDashboard.js';
import ParamNavigator from './ParamNavigator.js';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';

//Body
export default function App() {
  return (
    // Provides access to Redux store, and persists it till the user logs out
    <Provider store={store}>
      <PersistGate loading={<Spinner size="xl" />} persistor={persistor}>
        {/* Provides access to Chakra UI */}
        <ChakraProvider theme={theme}>
          {/* Provides routes to all of the pages in the app.
          Handles wrong routes. */}
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ProfilePage/:username" element={<Profile />} />
              <Route path="/Registration" element={<Registration />} />
              <Route path="/Threads/:id" element={<Thread />} />
              <Route path="/editThread/:id" element={<EditThread />} />
              <Route path="/editComment/:ids" element={<EditComment />} />
              <Route path="/ModDashboard" element={<ModDashboard />} />
              <Route path="/ParamNavigator" element={<ParamNavigator />} />
              <Route path="*" element={<ParamNavigator />} />
            </Routes>
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}