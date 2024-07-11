import React, { useState, useEffect } from 'react';
import { Modal, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import styled from 'styled-components';

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const StyledPaper = styled(Paper)({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: 20,
    width: '80%',
    maxHeight: '90vh',
    overflowY: 'scroll'
});

const StyledTable = styled(Table)({
    marginBottom: '20px', 
    '& th': {
        fontWeight: 'bold',
        textAlign: 'center' 
    },
    '& td': {
        textAlign: 'center', 
        maxWidth: '200px', 
        wordWrap: 'break-word', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis' 
    },
    '& caption': {
        marginBottom: '10px',
        fontWeight: 'bold'
    }
});

const JobDetailsModal = ({ jobId, open, handleClose }) => {
    const token = getToken();
    const [jobDetails, setJobDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://192.168.3.101:19999/api/jobs/${jobId}`, {
                    headers: { Authorization: `Bearer ${getToken()}` }
                });

                setJobDetails(response.data.results);

            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Lỗi kết nối, vui lòng thử lại sau.');
            }
            setLoading(false);
        };

        fetchJobDetails();
    }, [jobId]);

    const parseInteraction = (interaction, jobUrl) => {
        const regex = /\[(.*?)\]\s(.*?)\s\((.*?)\)/;
        const matches = regex.exec(interaction);
        return matches ? { unit: matches[1], name: matches[2], url: matches[3], jobUrl: jobUrl } : { unit: '', name: interaction, url: '#', jobUrl: jobUrl };
    };

    const aggregateData = (jobs) => {
        const aggregatedStats = [];
        const aggregatedUsers = [];

        jobs.forEach((job, index) => {
            aggregatedStats.push({
                ...job,
                index: index + 1
            });

            job.chuatuongtac.forEach((user, idx) => {
                const { name, url, unit } = parseInteraction(user, job.url);
                const existingUserIndex = aggregatedUsers.findIndex(u => u.name === name);
                if (existingUserIndex !== -1) {
                    aggregatedUsers[existingUserIndex].jobUrls.push(job.url);
                } else {
                    aggregatedUsers.push({
                        name,
                        url,
                        unit,
                        jobUrls: [job.url], // List of job URLs for each non-interacted user
                        jobIndex: index + 1
                    });
                }
            });
        });

        return { aggregatedStats, aggregatedUsers };
    };

    const { aggregatedStats, aggregatedUsers } = aggregateData(jobDetails);

    const handleUserClick = (user) => {
        setSelectedUser(user);
    };

    const handleUserModalClose = () => {
        setSelectedUser(null);
    };

    return (
        <StyledModal
            open={open}
            onClose={handleClose}
            aria-labelledby="job-details-modal"
            aria-describedby="job-details-display"
        >
            <StyledPaper>
                {loading ? <p>Đang tải dữ liệu ...</p> :
                error ? <p>{error}</p> :
                <>
                    <StyledTable aria-label="Statistical Data">
                        <caption style={{ textAlign: 'center' }}>Bảng 1.Dữ liệu thống kê</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>URL</TableCell>
                                <TableCell align="center">Tổng tương tác</TableCell>
                                <TableCell align="center">Thuộc đơn vị</TableCell>
                                <TableCell align="center">Ngoài đơn vị</TableCell>
                                <TableCell align="center">% Thuộc đơn vị</TableCell>
                                <TableCell align="center">% Ngoài đơn vị</TableCell>
                                <TableCell align="center">Cảm xúc</TableCell>
                                <TableCell align="center">Bình luận</TableCell>
                                <TableCell align="center">Chia sẻ</TableCell>
                                <TableCell align="center">Lượt xem</TableCell>
                                <TableCell align="center">Tổng điểm</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aggregatedStats.map((job, index) => (
                                <TableRow key={index}>
                                    <TableCell>{job.index}</TableCell>
                                    <TableCell>{job.url}</TableCell>
                                    <TableCell align="center">{job.tongtuongtac}</TableCell>
                                    <TableCell align="center">{job.tongtuongtacdonvi}</TableCell>
                                    <TableCell align="center">{job.tongtuongtackhongthuocdonvi}</TableCell>
                                    <TableCell align="center">{job.phantramdonvi}%</TableCell>
                                    <TableCell align="center">{job.phantramnguoingoai}%</TableCell>
                                    <TableCell align="center">{job.tongcamxuc}</TableCell>
                                    <TableCell align="center">{job.tongbinhluan}</TableCell>
                                    <TableCell align="center">{job.tongchiase}</TableCell>
                                    <TableCell align="center">{job.tongluotphat}</TableCell>
                                    <TableCell align="center">{job.tongdiem}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>

                    <StyledTable aria-label="Non-Interacted Users">
                        <caption style={{ textAlign: 'center' }}>Bảng 2.Người dùng chưa tương tác</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Liên kết cá nhân</TableCell>
                                <TableCell>Đơn vị</TableCell>
                                <TableCell>Tổng số bài chưa tương tác</TableCell>
                                <TableCell>Xem chi tiết</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aggregatedUsers.map((user, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.url}</TableCell>
                                    <TableCell>{user.unit}</TableCell>
                                    <TableCell>{user.jobUrls.length}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton onClick={() => handleUserClick(user)}>
                                                <Visibility />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>

                    <StyledModal
                        open={!!selectedUser}
                        onClose={handleUserModalClose}
                        aria-labelledby="user-details-modal"
                        aria-describedby="user-details-display"
                    >
                        <StyledPaper>
                            {selectedUser && (
                                <>
                                    <h2>Chi tiết bài viết chưa tương tác của {selectedUser.name}</h2>
                                    <ul>
                                        {selectedUser.jobUrls.map((url, index) => (
                                            <li key={index}>{url}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </StyledPaper>
                    </StyledModal>
                </>}
            </StyledPaper>
        </StyledModal>
    );
};

export default JobDetailsModal;
