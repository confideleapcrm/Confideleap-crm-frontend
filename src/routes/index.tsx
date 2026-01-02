// src/routes/index.tsx
import { Route, Routes } from "react-router-dom";
import { routes } from "../utils/routes";

interface AppRoutesProps {
  [key: string]: any;
}

const AppRoutes: React.FC<AppRoutesProps> = (props) => {
  return (
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
  );
};

export default AppRoutes;
