import React from "react";
import HomePage from "./components/HomePage";
import {Routes, Route } from "react-router-dom";

export const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<HomePage />}> </Route>
    </Routes>
  );
};

//<Route path="/" element={<Home />}></Route>