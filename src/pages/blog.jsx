import { Helmet } from 'react-helmet-async';
import { BlogView } from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function ProcessPage() {
  return (
    <>
      <Helmet>
        <title> Đơn vị trực thuộc </title>
      </Helmet>

      <BlogView />
    </>
  );
}
