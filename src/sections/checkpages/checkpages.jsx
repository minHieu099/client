import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Checkbox, Container, DialogActions, FormControlLabel, TextField, DialogTitle, Dialog, DialogContent, DialogContentText, Typography, CircularProgress, TablePagination } from '@mui/material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import styled from 'styled-components';
import { Box } from '@mui/system';
import JobDetailsModal from '../check/progress/view/jobDetailModal';
import { initializeWebSocket } from 'src/hooks/ws';

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

export default function PageCheckTable() {
  const [units, setUnits] = useState([]);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [selectedPageUrls, setSelectedPageUrls] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://192.168.3.101:19999/api/teams', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units data:', error);
    }
  };
  //tạo menu chọn đơn vị
  const fetchPages = async (id) => {
    try {
      const token = getToken();
      const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages data:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    fetchPages(unit._id);
    handleClose();
  };

  const handleSelectAllPages = (event) => {
    if (event.target.checked) {
      const allPageIds = pages.map(page => page._id);
      setSelectedPages(allPageIds);
      setSelectedPageUrls(pages.map(page => page.url));
    } else {
      setSelectedPages([]);
      setSelectedPageUrls([]);
    }
  };

  const handlePageSelect = (event, pageId, pageUrl) => {
    if (event.target.checked) {
      setSelectedPages(prevSelected => [...prevSelected, pageId]);
      setSelectedPageUrls(prevUrls => {
        const newUrls = [...prevUrls, pageUrl];
        return newUrls;
      });
    } else {
      setSelectedPages(prevSelected => prevSelected.filter(id => id !== pageId));
      setSelectedPageUrls(prevUrls => {
        const newUrls = prevUrls.filter(url => url !== pageUrl);
        return newUrls;
      });
    }
  };

  const [openDialogCheck, setOpenDialogCheck] = useState(false);
  const OpenDialog = () => {
    setOpenDialogCheck(true);
  };
  const CloseDialog = () => {
    setOpenDialogCheck(false);
  };

  const [formData, setFormData] = useState({
    url: '',
    description: '',
    post_per_target: '',
    quick_mode: false
  });
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: val
    });
  };
  const handleSubmit = async () => {
    const { description, post_per_target, quick_mode } = formData;
    const requestData = {
      targets: selectedPageUrls, // Use the selectedPageUrls directly
      description: description,
      post_per_target: parseInt(post_per_target),
      quick_mode: quick_mode,
    };

    console.log('Request Data:', requestData);

    await axios.post('http://192.168.3.101:19999/api/crawl/page', requestData, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then(response => {
        console.log('API Response:', response.data);
      })
      .catch(error => {
        console.error('API Error:', error);
      });

    CloseDialog();
  };

  //get API bảng
  const [dataCrawl, setDataCrawl] = useState([]);

  useEffect(() => {
    const fetchDataPage = async () => {
      try {
        const response = await axios.get('http://192.168.3.101:19999/api/jobs?type=page', { headers: { Authorization: `Bearer ${getToken()}` } })
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
  }, [openDialogCheck]);

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
      <Button
        aria-controls="unit-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Chọn đơn vị
      </Button>
      <Menu
        id="unit-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {units.map(unit => (
          <MenuItem key={unit._id} onClick={() => handleUnitSelect(unit)}>
            {unit.name}
          </MenuItem>
        ))}
      </Menu>

      <Button
        variant="contained"
        color="primary"
        onClick={OpenDialog}
        sx={{ mt: 2, ml: 2 }}
      >
        Kiểm tra
      </Button>

      {selectedUnit && (
        <div>

          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      indeterminate={selectedPages.length > 0 && selectedPages.length < pages.length}
                      checked={selectedPages.length === pages.length}
                      onChange={handleSelectAllPages}
                    />
                  </TableCell>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên trang</TableCell>
                  <TableCell>Url</TableCell>
                  <TableCell>Lượt theo dõi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.map((page, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPages.includes(page._id)}
                        onChange={(event) => handlePageSelect(event, page._id, page.url)}
                      />
                    </TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{page.name}</TableCell>
                    <TableCell>{page.url}</TableCell>
                    <TableCell>{page.follower}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </div>
      )}
      <DialogCheck openDialogCheck={openDialogCheck} CloseDialog={CloseDialog} selectedPageUrls={selectedPageUrls} handleSubmit={handleSubmit} handleChange={handleChange} />

      <RequestTable dataCrawl={dataCrawl} handleButtonClick={handleButtonClick} ProgressWithLabel={ProgressWithLabel}></RequestTable>

      <JobDetailsModal jobId={selectedJobId} open={modalOpen} handleClose={handleCloseModal} />

    </Container>
  );
}

const DialogCheck = ({ openDialogCheck, CloseDialog, selectedPageUrls, handleSubmit, handleChange }) => (
  <Dialog open={openDialogCheck} onClose={CloseDialog}>
    <DialogTitle>Thêm yêu cầu</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name='url'
        id="urls"
        label="Đường dẫn"
        type="text"
        fullWidth
        variant="standard"
        multiline
        rows={4}
        value={selectedPageUrls.join('\n')}
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        name='description'
        id="description"
        label="Mô tả tác vụ"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
      />
      <TextField
        margin="dense"
        name='post_per_target'
        id="post_per_target"
        label="Số lượng tin bài (tối đa 30 bài)"
        type="text"
        fullWidth
        variant="standard"
        onChange={handleChange}
      />
      <FormControlLabel
        name='quick_mode'
        control={
          <Checkbox
            color="primary"
            onChange={handleChange}
          />
        }
        label="Kiểm tra nhanh"
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={CloseDialog}>Hủy</Button>
      <Button onClick={handleSubmit}>Kiểm tra</Button>
    </DialogActions>
  </Dialog>
);

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