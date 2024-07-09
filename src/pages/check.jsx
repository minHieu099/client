import { Helmet } from 'react-helmet-async';
import { CheckView } from 'src/sections/check';
// ----------------------------------------------------------------------

export default function CheckPost() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát các kênh truyền thông </title>
      </Helmet>

      <CheckView />
    </>
  );
}
