import { Helmet } from 'react-helmet-async';
import ChartView from 'src/sections/chart/ChartView';

// ----------------------------------------------------------------------

export default function ChartPage() {
  return (
    <>
      <Helmet>
        <title> Biểu đồ thống kê </title>
      </Helmet>

      <ChartView />
    </>
  );
}
