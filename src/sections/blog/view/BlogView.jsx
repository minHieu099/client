import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { getToken } from 'src/routes/auth';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: 'center',
}));

const StyledTableHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

function BlogView() {
  const [unitData, setUnitData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.3.101:19999/api/teams',
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setUnitData(response.data);
        setError(null); // Clear any previous error if fetch succeeds
      } catch (error) {
        console.error('Error fetching unit data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, []);
  // useEffect(() => {
  //   // Dữ liệu cứng để thử nghiệm
  //   const hardcodedData = [
  //     { _id: '1', name: 'Đơn vị 1' },
  //     { _id: '2', name: 'Đơn vị 2' },
  //     { _id: '3', name: 'Đơn vị 3' },
  //   ];

  //   setUnitData(hardcodedData);
  //   setError(null); // Xóa lỗi trước đó nếu lấy dữ liệu thành công
  // }, []);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách đơn vị
      </Typography>
      {error ? (
        <Typography variant="h5" color="error" style={{ textAlign: 'center' }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableHeaderCell>TT</StyledTableHeaderCell>
                <StyledTableHeaderCell>Đơn vị</StyledTableHeaderCell>
                <StyledTableHeaderCell>Chức năng</StyledTableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unitData.map((row, index) => (
                <TableRow key={row._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell>
                    <Link to={`/dvtt/staff/${row._id}`}>
                      <StyledButton variant="contained" color="primary">
                        Danh sách cán bộ
                      </StyledButton>
                    </Link>
                    <Link to={`/dvtt/pages/${row._id}`}>
                      <Button variant="contained" color="secondary">
                        Danh sách trang
                      </Button>
                    </Link>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default BlogView;
