import { Route, Routes } from "react-router";

import { Layout } from "./layout/Layout";
import { Home } from "./home/Home";

import "./App.scss";
import { Contribute } from "./contribute/Contribute";
import { About } from "./about/About";
import { SignUp } from "./auth/SignUp";
import { SignIn } from "./auth/SignIn";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contribute" element={<Contribute />} />
      </Route>

      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
