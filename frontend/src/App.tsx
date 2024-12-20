import { BrowserRouter, Route, Routes } from "react-router-dom";
import Builder from "./views/Builder";
import LandingPage from "./views/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
