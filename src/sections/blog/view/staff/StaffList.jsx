import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { getToken } from 'src/routes/auth';
import { useRouter } from 'src/routes/hooks';
import Stack from '@mui/material/Stack';
import Label from 'src/components/label';
import {styled} from 'styled-components';

const CustomContainer = styled(Container)({
  textAlign: 'center',
  maxWidth: '1200px',
  margin: '50px auto',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

function StaffList() {
  const { id } = useParams();
  const token = getToken();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [addStaffDialog, setAddStaffDialog] = useState({
    team_id: id,
    url: "",
    profile_name: "",
    fullname: "",
  });
  const [editStaffDialog, setEditStaffDialog] = useState({
    profile_id: "",
    new_info: {
      fullname: "",
    }
  });

  const router = useRouter();
  // Fetch staff data
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/profiles`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setError('Lỗi kết nối, vui lòng thử lại sau.');
    }
  };
  useEffect(() => {
    fetchData(); // Gọi fetchData khi component mount và khi id thay đổi
  }, [id]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddStaffDialog(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleInputChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditStaffDialog(prevState => ({
      ...prevState,
      new_info: {
        ...prevState.new_info,
        [name]: value
      }
    }));
  };

  // Open add staff dialog
  const handleAddStaffOpen = () => {
    setOpenAdd(true);
  };
  // Handle dialog close
  const handleDialogClose = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setSelectedStaff(null);
  };
  // Handle save add
  const handleSaveAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        'http://192.168.3.101:19999/api/profiles/new',
        [addStaffDialog],  // Gửi dữ liệu từ state addStaffDialog lên server
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      handleShowToast('Thêm thành công!', 'success');
      handleDialogClose();
    } catch (error) {
      setError(error.message);
      handleShowToast('Thêm thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open edit staff dialog
  const handleEditOpen = (staff) => {
    setSelectedStaff(staff);
    setEditStaffDialog({
      profile_id: staff._id,
      new_info: {
        fullname: staff.fullname,
        url: staff.url,
        profile_name: staff.profile_name,
      }
    });
    setOpenEdit(true);
  };
  // Handle save edit
  const handleSaveEdit = async () => {
    try {
      console.log(editStaffDialog.profile_id);
      // Lấy token từ nơi nào đó
      const response = await axios.put(
        'http://192.168.3.101:19999/api/profiles/update',
        editStaffDialog,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      handleShowToast('Sửa thành công!', 'success');
      fetchData()
      handleDialogClose();
    } catch (error) {
      setError(error.message);
      handleShowToast('Xoá thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [idDelete, setIdDelete] = useState(null);
  //mở dialog confirm delete
  const dialogConfirmDelete = (idDel) => {
    setIdDelete(idDel)
    setConfirmDelete(true)
  }
  const handleDialogDeleteClose = () => {
    setConfirmDelete(false)
  }
  // Handle delete staff
  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `http://192.168.3.101:19999/api/profiles/${idDelete}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData()
      handleDialogDeleteClose()
      handleShowToast('Xoá thành công!', 'success');
    } catch (error) {
      setError(error.message);
      handleShowToast('Xoá thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleShowToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Container>
      <CustomContainer>
      <Header handleAddStaffOpen={handleAddStaffOpen} />
      {error && <Typography color="error">{error}</Typography>}
      {!error && <StaffTable dialogConfirmDelete={dialogConfirmDelete} staffList={staffList} handleEditOpen={handleEditOpen} />}
      <EditDialog
        openEdit={openEdit}
        selectedStaff={selectedStaff}
        handleDialogClose={handleDialogClose}
        handleSaveEdit={handleSaveEdit}
        handleInputChangeEdit={handleInputChangeEdit}
      />
      <AddDialog
        openAdd={openAdd}
        addStaffDialog={addStaffDialog}
        handleDialogClose={handleDialogClose}
        handleSaveAdd={handleSaveAdd}
        handleInputChange={handleInputChange}
      />
      <DialogDelete
        confirmDelete={confirmDelete}
        dialogConfirmDelete={dialogConfirmDelete}
        handleConfirmDelete={handleConfirmDelete}
        handleDialogDeleteClose={handleDialogDeleteClose}
      ></DialogDelete>
      <Toast
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        severity={toast.severity}
      />
      </CustomContainer>
    </Container>
  );
}

// Header component
const Header = ({ handleAddStaffOpen }) => (
  <>
  <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
    <Typography variant="h4" component="h1" gutterBottom>
      Tài khoản MXH
    </Typography>
    <Button
      variant="contained"
      color="primary"
      startIcon={<Iconify icon="eva:plus-fill" />}
      style={{ marginBottom: '10px' }}
      onClick={handleAddStaffOpen}
    >Thêm
    </Button>
  </Stack>
    
  </>
);

// StaffTable component
const StaffTable = ({ staffList, handleEditOpen, dialogConfirmDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell align="center" style={{ width: '5%' }}>STT</TableCell>
          <TableCell align="center" style={{ width: '15%' }}>Đơn vị</TableCell>
          <TableCell align="center" style={{ width: '20%' }}>Chủ tài khoản</TableCell>
          <TableCell align="center" style={{ width: '30%' }}>Đường dẫn</TableCell>
          <TableCell align="center" style={{ width: '30%' }}>Chức năng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {staffList.map((staff, index) => (
          <TableRow key={staff._id}>
            <TableCell align="center">{index + 1}</TableCell>
            <TableCell align="center"><Label color={'success'}>{staff.team}</Label></TableCell>
            <TableCell align="left">{staff.fullname}</TableCell>
            <TableCell>
              <a href={staff.url} target="_blank" rel="noopener noreferrer">{staff.url}</a>
            </TableCell>
            <TableCell align="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditOpen(staff)}
                style={{ marginRight: '10px' }}
              ><Iconify icon="eva:edit-fill" />
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => dialogConfirmDelete(staff._id)}
              ><Iconify icon="eva:trash-2-outline" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// EditDialog component
const EditDialog = ({ openEdit, selectedStaff, handleDialogClose, handleSaveEdit, handleInputChangeEdit }) => (

  <Dialog open={openEdit} onClose={handleDialogClose}>
    <DialogTitle>Sửa thông tin cán bộ</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="fullname"
        label="Tên cán bộ"
        type="text"
        fullWidth
        defaultValue={selectedStaff?.fullname || ''}
        // value={editStaffDialog?.fullname || ''}
        onChange={(e) => handleInputChangeEdit(e)}
      />
      <TextField
        margin="dense"
        name="url"
        label="Đường dẫn"
        type="text"
        fullWidth
        defaultValue={selectedStaff?.url || ''}
        // value={editStaffDialog?.url || ''}
        onChange={(e) => handleInputChangeEdit(e)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose} color="primary">
        Hủy
      </Button>
      <Button onClick={handleSaveEdit} color="primary">
        Lưu
      </Button>
    </DialogActions>
  </Dialog>
);

// AddDialog component
const AddDialog = ({ openAdd, handleDialogClose, handleSaveAdd, handleInputChange, }) => (
  <Dialog open={openAdd} onClose={handleDialogClose}>
    <DialogTitle>Thêm tài khoản mới</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="fullname"
        label="Tên cán bộ"
        type="text"
        fullWidth
        onChange={(e) => handleInputChange(e)}
      />
      <TextField
        margin="dense"
        name="url"
        label="Đường dẫn"
        type="text"
        fullWidth
        onChange={(e) => handleInputChange(e)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogClose} color="primary">
        Hủy
      </Button>
      <Button onClick={handleSaveAdd} color="primary">
        Thêm
      </Button>
    </DialogActions>
  </Dialog>
);

const DialogDelete = ({ confirmDelete, handleDialogDeleteClose, handleConfirmDelete }) => (
  <Dialog open={confirmDelete} onClose={handleDialogDeleteClose}>
    <DialogTitle>Xác nhận xóa</DialogTitle>
    <DialogContent>
      <Typography>Bạn có chắc chắn muốn xóa trang này không?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDialogDeleteClose} color="primary">
        Hủy
      </Button>
      <Button onClick={handleConfirmDelete} color="secondary">
        Xóa
      </Button>
    </DialogActions>
  </Dialog>
);

const Toast = ({ open, onClose, message, severity }) => (
  <Snackbar
    open={open}
    autoHideDuration={3000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

export default StaffList;
