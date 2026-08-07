import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TrackPage from "./pages/TrackPage";
import ModulePage from "./pages/ModulePage";
import ExamPage from "./pages/ExamPage";
import CertHubPage from "./pages/CertHubPage";
import CertExamPage from "./pages/CertExamPage";
import ProgressPage from "./pages/ProgressPage";
import NotFoundPage from "./pages/NotFoundPage";

const rootRoute = createRootRoute({
  component: Layout,
  notFoundComponent: NotFoundPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track/$trackSlug",
  component: TrackPage,
});

const moduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track/$trackSlug/modul/$moduleSlug",
  component: ModulePage,
});

const examRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track/$trackSlug/simulasi",
  component: ExamPage,
});

const certHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/simulasi-certified",
  component: CertHubPage,
});

const certExamRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track/$trackSlug/simulasi-certified",
  component: CertExamPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progres",
  component: ProgressPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  trackRoute,
  moduleRoute,
  examRoute,
  certHubRoute,
  certExamRoute,
  progressRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
