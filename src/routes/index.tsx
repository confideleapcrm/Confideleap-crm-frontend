import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { routes } from "../utils/routes";

interface AppRoutesProps {
  [key: string]: any;
}

const PageLoader = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>Loading page...</h2>
  </div>
);

const AppRoutes: React.FC<AppRoutesProps> = (props) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routes.map((item, index) => {
          const Component = item.component;
          return (
            <Route
              key={"route" + index}
              path={item.path}
              element={<Component {...props} />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
