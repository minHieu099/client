import { Helmet } from 'react-helmet-async';
import { ProgressView } from 'src/sections/check/progress/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> . </title>
      </Helmet>

      <ProgressView />
    </>
  );
}
