import { Helmet } from 'react-helmet-async';
import ChartView from 'src/sections/chart/ChartView';

// ----------------------------------------------------------------------

export default function ChartPage() {
  return (
    <>
      <Helmet>
        <title> Hệ thống quản lý, giám sát các kênh truyền thông </title>
      </Helmet>

      <ChartView />
    </>
  );
}
