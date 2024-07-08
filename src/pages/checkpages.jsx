import { Helmet } from 'react-helmet-async';
import { PageCheckTable } from 'src/sections/checkpages';
// ----------------------------------------------------------------------

export default function CheckPost() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát tương tác các kênh truyền thông MXH Facebook </title>
      </Helmet>

      <PageCheckTable />
    </>
  );
}
