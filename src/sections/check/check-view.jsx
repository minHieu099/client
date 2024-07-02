import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import MenuButton from './MenuButton';
import PostContent from './checkpost/PostContent';
import PageCheckTable from './checkpage/PageCheckTable';

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
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  return (
    <CustomContainer>
      <Typography variant="h4" align="center" sx={{ color: 'red' }}>
        Hệ thống quản lý, giám sát tương tác các kênh truyền thông MXH Facebook
      </Typography>

      <Box mt={4}>
        <MenuButton setSelectedMenuItem={setSelectedMenuItem} />
      </Box>

      {selectedMenuItem === 'post' && (
        <Box mt={4}>
          <PostContent />
        </Box>
      )}

      {selectedMenuItem === 'page' && (
        <Box mt={4}>
          <PageCheckTable />
        </Box>
      )}
    </CustomContainer>
  );
}
