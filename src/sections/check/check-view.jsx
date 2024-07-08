import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { styled } from '@mui/system';
import PostContent from './checkpost/PostContent';

const CustomContainer = styled(Container)({
  textAlign: 'center',
  maxWidth: '800px',
  margin: '50px auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

export default function CheckView() {

  return (
    <CustomContainer>
        <PostContent />
    </CustomContainer>
  );
}
