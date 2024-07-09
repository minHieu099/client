import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { getToken } from 'src/routes/auth';

// ----------------------------------------------------------------------

export default function UserTableRow({
  stt, selected, name, company, role, status, id_del, fetchData, handleShowToast
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  //xoá đơn vị
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const OpenDialogDel = () => {
    setOpenDialogDelete(true)
  }
  const CloseDialogDel = () => {
    setOpenDialogDelete(false)
  }
  const DeleteDV = async () => {
    try {
      await axios.delete(`http://192.168.3.101:19999/api/users/volunteers/${id_del}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      handleShowToast('Xoá thành công!', 'success');
      CloseDialogDel();
    } catch (error) {
      setError(error.message);
      console.log(error);
      handleShowToast('Xoá thất bại!', 'error');
      CloseDialogDel();
    } finally {
      setLoading(false);
    }
  };

  const [newPassword, setNewPassword] = useState('');
  const [openDialogEdit, setOpenDialogEdit] = useState(false)

  const OpenDialogEdit = (dv) => {
    setOpenDialogEdit(true);
  }
  const CloseDialogEdit = (dv) => {
    setOpenDialogEdit(false);
  }

  const InputChangeEdit = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setNewPassword(value);
    }
  };

  const EditSave = async () => {
    const data = {
      volunteer_id: id_del,
      new_password: newPassword,
    };

    try {
      await axios.put('http://192.168.3.101:19999/api/users/volunteers/update', data, {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      handleShowToast('Thay đổi mật khẩu thành công!', 'success');
      CloseDialogEdit();
    } catch (error) {
      console.error('Error:', error);
      handleShowToast('Thay đổi mật khẩu thất bại!', 'error');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>

        <TableCell>{stt}</TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{company}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 50 },
        }}
      >
        <MenuItem onClick={OpenDialogEdit}>
          <Iconify icon="eva:edit-fill" />
        </MenuItem>

        <MenuItem onClick={OpenDialogDel}>
          <Iconify icon="eva:trash-2-outline" sx={{ }} />
        </MenuItem>
        <DeleteUser
          openDialogDelete={openDialogDelete}
          CloseDialogDel={CloseDialogDel}
          DeleteDV={DeleteDV}
        ></DeleteUser>

        <ChangePass
          openDialogEdit={openDialogEdit}
          OpenDialogEdit={OpenDialogEdit}
          InputChangeEdit={InputChangeEdit}
          CloseDialogEdit={CloseDialogEdit}
          EditSave={EditSave}
        ></ChangePass>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};

const DeleteUser = ({ openDialogDelete, CloseDialogDel, DeleteDV }) => (
  <Dialog open={openDialogDelete} onClose={CloseDialogDel}>
    <DialogTitle>Xác nhận xóa</DialogTitle>
    <DialogContent>
      <Typography>Bạn có chắc là xoá không?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={CloseDialogDel} color="primary">
        Hủy
      </Button>
      <Button onClick={DeleteDV} color="secondary">
        Xóa
      </Button>
    </DialogActions>
  </Dialog>
);

const ChangePass = ({ openDialogEdit, CloseDialogEdit, InputChangeEdit, EditSave }) => (
  <Dialog open={openDialogEdit} onClose={CloseDialogEdit}>
    <DialogTitle>Thay đổi mật khẩu</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="password"
        label="Nhập mật khẩu mới"
        type="password"
        fullWidth
        onChange={InputChangeEdit}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={CloseDialogEdit} color="primary">
        Hủy
      </Button>
      <Button onClick={EditSave} color="primary">
        Lưu
      </Button>
    </DialogActions>
  </Dialog>
);