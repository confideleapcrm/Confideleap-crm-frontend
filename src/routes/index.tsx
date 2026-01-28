import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../utils/routes";
import ProtectedRoutes from "../components/ProtectedRoutes";

interface AppRoutesProps {
  [key: string]: any;
}

const PageLoader = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>Loading page...</h2>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      {/* <ProtectedRoutes> */}
      <Routes>
        {routes.map((item, index) => {
          const Component = item.component;
          return (
            <Route
              key={`route-${index}`}
              path={item.path}
              element={<Component />}
            />
          );
        })}
      </Routes>
      {/* </ProtectedRoutes> */}
    </Suspense>
  );
};

export default AppRoutes;
