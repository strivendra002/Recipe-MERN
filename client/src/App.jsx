import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";

// Lazy Load Pages (Optimizes Performance)
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/Login"));
const RecipeSearch = lazy(() => import("./pages/RecipeSearch"));
const Favorites = lazy(() => import("./pages/Favorites"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails"));

function App() {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<RecipeSearch />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
