import { Routes, Route } from 'react-router-dom';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';

export function Router() {
  return (
    <>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        {/* 404 page */}
        <Route
          path="*"
          element={<h1 className="font-semibold">404 Not found</h1>}
        />
      </Routes>
    </>
  );
}
