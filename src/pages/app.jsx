import { Helmet } from 'react-helmet-async';
import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát các kênh truyền thông </title>
      </Helmet>

      <AppView />
    </>
  );
}
