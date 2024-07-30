import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
import { getToken } from 'src/routes/auth';

function CreateTaskDialog({ open, handleClose }) {
  const [inputUrls, setInputUrls] = useState('');
  const [description, setDescription] = useState('');
  const [quickMode, setQuickMode] = useState(false);

  const handleCheck = async () => {
    try {
      await axios.post(
        'http://192.168.3.101:19999/api/crawl/post',
        {
          targets: inputUrls.split('\n').map((url) => url.trim()),
          description: description,
          quick_mode: quickMode,
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      handleClose();
    } catch (error) {
      alert('Lỗi kết nối, vui lòng thử lại sau.');
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Thêm yêu cầu</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>Nhập các đường dẫn và mô tả</DialogContentText> */}
        <TextField
          autoFocus
          margin="dense"
          id="urls"
          label="Đường dẫn"
          type="text"
          fullWidth
          variant="standard"
          value={inputUrls}
          onChange={(e) => setInputUrls(e.target.value)}
          multiline
          rows={4} 
        />
        <TextField
          margin="dense"
          id="description"
          label="Mô tả tác vụ"
          type="text"
          fullWidth
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={quickMode}
              onChange={(e) => setQuickMode(e.target.checked)}
              color="primary"
            />
          }
          label="Kiểm tra nhanh"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleCheck}>Kiểm tra</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateTaskDialog;
