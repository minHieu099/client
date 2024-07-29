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
        let aggregatedStats = [];
        let aggregatedLazyUsers = [];
        let aggregatedGoodUsers = [];
        let aggregatedUnits = [];

        jobs.forEach((job, index) => {
            aggregatedStats.push({
                ...job,
                index: index + 1
            });

            job.chuatuongtac.forEach((user, idx) => {
                const { name, url, unit } = parseInteraction(user, job.url);
                const existingUserIndex = aggregatedLazyUsers.findIndex(u => u.name === name);
                if (existingUserIndex !== -1) {
                    aggregatedLazyUsers[existingUserIndex].jobUrls.push(job.url);
                } else {
                    aggregatedLazyUsers.push({
                        name,
                        url,
                        unit,
                        jobUrls: [job.url], // List of job URLs for each non-interacted user
                    });
                }
            });

            job.datuongtac.forEach((user, idx) => {
                const { name, url, unit } = parseInteraction(user, job.url);
                const existingUserIndex = aggregatedGoodUsers.findIndex(u => u.name === name);
                if (existingUserIndex !== -1) {
                    aggregatedGoodUsers[existingUserIndex].jobUrls.push(job.url);
                } else {
                    aggregatedGoodUsers.push({
                        name,
                        url,
                        unit,
                        jobUrls: [job.url], // List of job URLs for each non-interacted user
                    });
                }
            });

            if (job.thongke_donvi) {
                Object.entries(job.thongke_donvi).forEach((data) => {
                    const existingUnitIndex = aggregatedUnits.findIndex(u => u.unit === data[0])
    
                    if (existingUnitIndex !== -1) {
                        aggregatedUnits[existingUnitIndex].counter += data[1];
                    } else {
                        aggregatedUnits.push({
                            unit: data[0],
                            counter: data[1]
                        });
                    }
    
                })
            }
            
        });

        // aggregatedLazyUsers.sort((a,b) => {
        //     if (a.jobUrls.length < b.jobUrls.length) {
        //         return 1;
        //     }
        //     if (a.jobUrls.length > b.jobUrls.length) {
        //         return -1;
        //     }
        //     return 0;
        // })

        aggregatedLazyUsers = aggregatedLazyUsers.filter((user) => user.jobUrls.length == jobDetails.length)

        aggregatedGoodUsers.sort((a,b) => {
            if (a.jobUrls.length < b.jobUrls.length) {
                return 1;
            }
            if (a.jobUrls.length > b.jobUrls.length) {
                return -1;
            }
            return 0;
        })

        aggregatedUnits.sort((a,b) => {
            if (a.counter < b.counter) {
                return 1;
            }
            if (a.counter > b.counter) {
                return -1;
            }
            return 0;
        })

        aggregatedStats.sort((a,b) => {
            if (a.tongdiem < b.tongdiem) {
                return 1;
            }
            if (a.tongdiem > b.tongdiem) {
                return -1;
            }
            return 0;
        })

        return { aggregatedStats: aggregatedStats.slice(0, 5), aggregatedGoodUsers: aggregatedGoodUsers.slice(0, 3), aggregatedLazyUsers, aggregatedUnits };
    };

    const { aggregatedStats, aggregatedGoodUsers, aggregatedLazyUsers, aggregatedUnits } = aggregateData(jobDetails);

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
                        <caption style={{ textAlign: 'center' }}>Bảng 1. Top 5 tin bài tốt nhất</caption>
                        <TableHead>
                            <TableRow>
                                {/* <TableCell>STT</TableCell> */}
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
                                    {/* <TableCell>{job.index}</TableCell> */}
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

                    <StyledTable aria-label="Statistical Unit">
                        <caption style={{ textAlign: 'center' }}>Bảng 2. Thống kê theo đơn vị</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hạng</TableCell>
                                <TableCell align="center">Đơn vị</TableCell>
                                <TableCell align="center">Tổng lượt tương tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aggregatedUnits.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    <TableCell align="center">{data.unit}</TableCell>
                                    <TableCell align="center">{data.counter}</TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </StyledTable>

                    <StyledTable aria-label="Non-Interacted Users">
                        <caption style={{ textAlign: 'center' }}>Bảng 3. Người dùng tương tác tốt</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Tên</TableCell>
                                <TableCell>Liên kết cá nhân</TableCell>
                                <TableCell>Đơn vị</TableCell>
                                <TableCell>Tổng số bài đã tương tác</TableCell>
                                <TableCell>Xem chi tiết</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {aggregatedGoodUsers.map((user, idx) => (
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

                    <StyledTable aria-label="Non-Interacted Users">
                        <caption style={{ textAlign: 'center' }}>Bảng 4. Người dùng không tương tác</caption>
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
                            {aggregatedLazyUsers.map((user, idx) => (
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
                                    <h2>{selectedUser.name}</h2>
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
