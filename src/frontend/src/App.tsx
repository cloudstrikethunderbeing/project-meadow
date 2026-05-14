import { Layout } from "@/components/Layout";
import { Activity } from "@/pages/Activity";
import { Admin } from "@/pages/Admin";
import { Chapters } from "@/pages/Chapters";
import { Community } from "@/pages/Community";
import { CommunityOpportunities } from "@/pages/CommunityOpportunities";
import { CommunitySupport } from "@/pages/CommunitySupport";
import { Join } from "@/pages/Join";
import { Landing } from "@/pages/Landing";
import { MapDirectory } from "@/pages/MapDirectory";
import { MemberProfile } from "@/pages/MemberProfile";
import { Membership } from "@/pages/Membership";
import { Supporters } from "@/pages/Supporters";
import { Volunteer } from "@/pages/Volunteer";
import { WalletGuide } from "@/pages/WalletGuide";
import { WhyLocal } from "@/pages/WhyLocal";
import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Landing,
});
const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/map",
  component: MapDirectory,
});
const memberRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/member/$id",
  component: MemberProfile,
});
const joinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join",
  component: Join,
});
const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community",
  component: Community,
});
const volunteerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/volunteer",
  component: Volunteer,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const walletGuideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet-guide",
  component: WalletGuide,
});
const activityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activity",
  component: Activity,
});
const whyLocalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/why-local",
  component: WhyLocal,
});
const communitySupportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community-support",
  component: CommunitySupport,
});

const chaptersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chapters",
  component: Chapters,
});
const membershipRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/membership",
  component: Membership,
});
const supportersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/supporters",
  component: Supporters,
});

const communityOpportunitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/community-opportunities",
  component: CommunityOpportunities,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  mapRoute,
  memberRoute,
  joinRoute,
  communityRoute,
  volunteerRoute,
  adminRoute,
  walletGuideRoute,
  activityRoute,
  whyLocalRoute,
  communitySupportRoute,
  membershipRoute,
  supportersRoute,
  chaptersRoute,
  communityOpportunitiesRoute,
]);

const router = createRouter({ routeTree, history: createHashHistory() });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InternetIdentityProvider>
        <RouterProvider router={router} />
      </InternetIdentityProvider>
    </QueryClientProvider>
  );
}
