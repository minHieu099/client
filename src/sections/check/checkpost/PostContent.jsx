import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

import { getToken } from 'src/routes/auth';
import { initializeWebSocket } from '../../../hooks/ws';
import CreateTaskDialog from './CreateTestDialog';
import JobDetailsModal from '../progress/view/jobDetailModal';
// Styled components
const StyledTableContainer = styled(TableContainer)({
  marginTop: '20px',
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
});

const StyledTableCell = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#f4f4f4',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f9f9f9',
  },
  '&:hover': {
    backgroundColor: '#f1f1f1',
  },
});
const ProgressWithLabel = ({ value }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={value} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default function PostContent() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJobId(null);
  };
  const handleButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setModalOpen(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.3.101:19999/api/jobs`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
    const cleanupWebSocket = initializeWebSocket(
      (payload) => {
        fetchData();
      },
      () => {}
    );
    return () => {
      cleanupWebSocket();
    };
  }, [dialogOpen]);

  return (
    <>
      <Container>
        <Box display="flex" justifyContent="flex-end" marginTop={2} marginBottom={2}>
          <Button variant="contained" color="primary" onClick={handleOpenDialog}>
            Tạo kiểm tra mới
          </Button>
        </Box>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <StyledTableContainer component={Paper} style={{ height: '60vh', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Job ID</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                
                <StyledTableCell align="right">Total</StyledTableCell>
                <StyledTableCell align="right">Status</StyledTableCell>
                <StyledTableCell align="right">Created At</StyledTableCell>
                <StyledTableCell align="right">Updated At</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((job) => (
                <StyledTableRow key={job.job_id}>
                  <TableCell>{job.job_id}</TableCell>
                  <TableCell>{job.description || 'N/A'}</TableCell>
                  
                  <TableCell align="right">{job.total}</TableCell>
                  <TableCell align="right">
                    {<ProgressWithLabel value={(job.success / job.total) * 100} />}
                  </TableCell>
                  <TableCell align="right">{new Date(job.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">{new Date(job.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      disabled={!job.finished}
                      onClick={() => handleButtonClick(job.job_id)}
                    >
                      Xem chi tiết
                    </Button>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={jobs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </StyledTableContainer>
      </Container>
      <CreateTaskDialog open={dialogOpen} handleClose={handleCloseDialog} />
      <JobDetailsModal jobId={selectedJobId} open={modalOpen} handleClose={handleCloseModal} />
    </>
  );
}
