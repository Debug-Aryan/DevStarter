import { Routes, Route } from "react-router-dom";
import Home from "../pages/HomePage";
import Generator from "../pages/Generator";
import Success from "../pages/Success";
import FeatureToggle from "../features/generator/components/FeatureToggle";
import ProjectInfoForm from "../features/generator/components/ProjectInfoForm";
import ScrollToTop from "./ScrollToTop";

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generate" element={<Generator />}>
          <Route path="features" element={<FeatureToggle />} />
          <Route path="features/project" element={<ProjectInfoForm />} />
        </Route>
        <Route path="/success" element={<Success />} />
      </Routes>
    </>
  );
}
