import { Helmet } from 'react-helmet-async';
import { PageCheckTable } from 'src/sections/checkpages';
import Container from '@mui/material/Container';
import { styled } from 'styled-components';
// ----------------------------------------------------------------------

const CustomContainer = styled(Container)({

  margin: '50px auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

export default function CheckPost() {
  return (
    <CustomContainer>
      <PageCheckTable />
    </CustomContainer>
  );
}
