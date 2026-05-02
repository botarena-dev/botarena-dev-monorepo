import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { Home } from "./home/Home";

import "./App.scss";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
