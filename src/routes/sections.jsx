import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import { isAuthenticated } from './auth';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const CheckPost = lazy(() => import('src/pages/check'));
export const CheckPages = lazy(() => import('src/pages/checkpages'));
export const StaffPage = lazy(() => import('src/pages/staff'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const PageList = lazy(() => import('src/sections/blog/view/page/PageList'));
export const SchedulePage = lazy(() => import('src/pages/schedule'));
export const ChartPage = lazy(() => import('src/pages/chart'));
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: isAuthenticated() ? (
        <DashboardLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        {
          path: 'dvtt', element: <BlogPage />,
        },
        { path: 'dvtt/staff/:id', element: <StaffPage /> },
        { path: 'dvtt/pages/:id', element: <PageList /> },
        { path: 'checkpost', element: <CheckPost /> },
        { path: 'checkpages', element: <CheckPages /> },
        { path: 'scheduled', element: <SchedulePage /> },
        { path: 'chart', element: <ChartPage /> }
      ]
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
