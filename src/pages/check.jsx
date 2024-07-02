import { Helmet } from 'react-helmet-async';
import { CheckView } from 'src/sections/check';
// ----------------------------------------------------------------------

export default function CheckPage() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát tương tác các kênh truyền thông MXH Facebook </title>
      </Helmet>

      <CheckView />
    </>
  );
}
