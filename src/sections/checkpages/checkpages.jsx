import React, { useState, useEffect } from 'react';
import { Button, Menu, MenuItem, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Checkbox, Container, DialogActions, FormControlLabel, TextField, DialogTitle, Dialog, DialogContent, DialogContentText } from '@mui/material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import styled from 'styled-components';
import { Box } from '@mui/system';
import JobDetailsModal from '../check/progress/view/jobDetailModal';

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
  const handleSubmit = () => {
    const { description, post_per_target, quick_mode } = formData;
    const requestData = {
      targets: selectedPageUrls, // Use the selectedPageUrls directly
      description: description,
      post_per_target: parseInt(post_per_target),
      quick_mode: quick_mode,
    };

    console.log('Request Data:', requestData);

    axios.post('http://192.168.3.101:19999/api/crawl/page', requestData, {
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

    axios.get('http://192.168.3.101:19999/api/jobs?type=page', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((response) => {
        setDataCrawl(response.data);
      })
      .catch((error) => {
        console.error('Lỗi khi gọi API:', error);
      });
  }, []);

  return (
    <Container>
      <Button
        aria-controls="unit-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2, mx: 'auto', display: 'block' }}
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

      {selectedUnit && (
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={OpenDialog}
            sx={{ ml: 2, mb: 2 }}
          >
            Kiểm tra trang đã chọn
          </Button>
          <TableContainer component={Paper}>
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
          </TableContainer>
        </div>
      )}
      <DialogCheck open={openDialogCheck} CloseDialog={CloseDialog} selectedPageUrls={selectedPageUrls} handleSubmit={handleSubmit} handleChange={handleChange} />

      <RequestTable dataCrawl={dataCrawl}></RequestTable>

    </Container>
  );
}

const DialogCheck = ({ open, CloseDialog, selectedPageUrls, handleSubmit, handleChange }) => (
  <Dialog open={open} onClose={CloseDialog}>
    <DialogTitle>Thêm kiểm tra mới</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name='url'
        id="urls"
        label="Đường dẫn bài viết"
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
        label="Số lượng bài (tối đã 30 bài)"
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

const RequestTable = ({ dataCrawl }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID yêu cầu</TableCell>
          <TableCell>Mô tả</TableCell>
          <TableCell>Tổng</TableCell>
          <TableCell>Trạng thái</TableCell>
          <TableCell>Ngày tạo</TableCell>
          <TableCell>Ngày cập nhật</TableCell>
          <TableCell>Hành động</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataCrawl.map((request) => (
          <TableRow key={request.job_id}>
            <TableCell>{request.job_id}</TableCell>
            <TableCell>{request.description}</TableCell>
            <TableCell>{request.total}</TableCell>
            <TableCell>{request.finished ? 'Hoàn thành' : 'Chưa hoàn thành'}</TableCell>
            <TableCell>{request.createdAt}</TableCell>
            <TableCell>{request.updatedAt}</TableCell>
            <TableCell align="right">
              <Button
                variant="contained"
                // disabled={!job.finished}
                // onClick={() => handleButtonClick(job.job_id)}
              >
                Xem chi tiết
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};