import { Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { initializeWebSocket } from 'src/hooks/ws';
import { getToken } from 'src/routes/auth';
import styled from 'styled-components';
import JobDetailsModal from '../check/progress/view/jobDetailModal';

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

export default function ScheduleCheck() {

    //get API bảng
    const [dataCrawl, setDataCrawl] = useState([]);

    useEffect(() => {
        const fetchDataPage = async () => {
            try {
                const response = await axios.get('http://192.168.3.101:19999/api/jobs?type=schedule', { headers: { Authorization: `Bearer ${getToken()}` } })
                setDataCrawl(response.data);
            } catch (error) {
                setError('Tải dữ liệu thất bại, vui lòng thử lại sau.');
            }
        }
        fetchDataPage();
        const cleanupWebSocket = initializeWebSocket(
            (payload) => {
                fetchDataPage();
            },
            () => { }
        );
        return () => {
            cleanupWebSocket();
        };
    }, []);

    //xem chi tiết
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const handleButtonClick = (jobId) => {
        setSelectedJobId(jobId);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedJobId(null);
    };
    return (

        <Container sx={{ ml: 0.6 }}>

            <RequestTable dataCrawl={dataCrawl} handleButtonClick={handleButtonClick} ProgressWithLabel={ProgressWithLabel}></RequestTable>

            <JobDetailsModal jobId={selectedJobId} open={modalOpen} handleClose={handleCloseModal} />

        </Container>
    );
}

const RequestTable = ({ dataCrawl, handleButtonClick, ProgressWithLabel }) => {
    return (
        <StyledTableContainer component={Paper} style={{ height: '60vh', overflow: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center">Mã tác vụ</StyledTableCell>
                        <StyledTableCell align="center">Mô tả</StyledTableCell>
                        <StyledTableCell align="center">Số tin bài</StyledTableCell>
                        <StyledTableCell align="center">Trạng thái</StyledTableCell>
                        <StyledTableCell align="center">Ngày tạo</StyledTableCell>
                        <StyledTableCell align="center">Ngày cập nhật</StyledTableCell>
                        <StyledTableCell align="center" style={{ width: '20%' }}>Hành động</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataCrawl.map((request) => (
                        <StyledTableRow key={request.job_id}>
                            <TableCell>{request.job_id}</TableCell>
                            <TableCell>{request.description || 'N/A'}</TableCell>
                            <TableCell align="center">{request.total}</TableCell>
                            <TableCell align="center">{<ProgressWithLabel value={(request.success / request.total) * 100} />}</TableCell>
                            <TableCell align="center">{new Date(request.createdAt).toLocaleString('en-UK', { hour12: false })}</TableCell>
                            <TableCell align="center">{new Date(request.updatedAt).toLocaleString('en-UK', { hour12: false })}</TableCell>
                            <TableCell align="center">
                                <Button
                                    variant="contained"
                                    disabled={!request.finished}
                                    onClick={() => handleButtonClick(request.job_id)}
                                >
                                    Xem chi tiết
                                </Button>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </StyledTableContainer>
    );
};