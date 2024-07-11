import Container from '@mui/material/Container';
import  ScheduleCheck  from 'src/sections/schedule/ScheduleCheck';
import { styled } from 'styled-components';
// ----------------------------------------------------------------------

const CustomContainer = styled(Container)({

  margin: '50px auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

export default function SchedulePage() {
  return (
    <CustomContainer>
      <ScheduleCheck />
    </CustomContainer>
  );
}
