import { Helmet } from 'react-helmet-async';
import StaffList from 'src/sections/blog/view/staff/StaffList';

// ----------------------------------------------------------------------

export default function StaffPage() {
  return (
    <>
      <Helmet>
        <title> Danh sách cán bộ </title>
      </Helmet>

      <StaffList />
    </>
  );
}
