import { Helmet } from 'react-helmet-async';
import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function ProcessPage() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát các kênh truyền thông </title>
      </Helmet>

      <BlogView />
    </>
  );
}
