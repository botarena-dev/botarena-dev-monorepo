import { Route, Routes } from "react-router";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
    </Routes>
  );
}

export default App;
