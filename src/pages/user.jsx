import { Helmet } from 'react-helmet-async';
import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát các kênh truyền thông </title>
      </Helmet>

      <UserView />
    </>
  );
}
