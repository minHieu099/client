import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/system';
import { getToken } from 'src/routes/auth';
import axios from 'axios';
import JobDetailsModal from './jobDetailModal';
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

function ProcessView() {
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.3.101:19999/api/crawl/jobs`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Lỗi kết nối, vui lòng thử lại sau.');
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = (jobId) => {
    setSelectedJobId(jobId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedJobId(null);
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tiến độ công việc
      </Typography>
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Job ID</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <StyledTableRow key={job.job_id}>
                <TableCell component="th" scope="row">
                  {job.job_id}
                </TableCell>
                <TableCell align="right">{job.finished ? 'Hoàn thành' : 'Đang xử lý'}</TableCell>
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
      </StyledTableContainer>
      <JobDetailsModal jobId={selectedJobId} open={modalOpen} handleClose={handleCloseModal} />
    </Container>
  );
}

export default ProcessView;
