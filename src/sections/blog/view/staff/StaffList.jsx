import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import { useRouter } from 'src/routes/hooks';

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/profiles`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        setStaffList(response.data);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

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
      router.reload();
      handleDialogClose();
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle save add
  const handleSaveAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy token từ nơi nào đó
      const response = await axios.post(
        'http://192.168.3.101:19999/api/profiles/new',
        [addStaffDialog],  // Gửi dữ liệu từ state addStaffDialog lên server
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.reload();
      handleDialogClose();
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete staff
  const handleDelete = async (staffId) => {
    console.log(staffId);
    try {
      await axios.delete(
        `http://192.168.3.101:19999/api/profiles/${staffId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.reload();
    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header handleAddStaffOpen={handleAddStaffOpen} />
      {error && <Typography color="error">{error}</Typography>}
      {!error && <StaffTable staffList={staffList} handleEditOpen={handleEditOpen} handleDelete={handleDelete} />}
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
    </Container>
  );
}

// Header component
const Header = ({ handleAddStaffOpen }) => (
  <>
    <Typography variant="h4" component="h1" gutterBottom>
      Danh sách cán bộ
    </Typography>
    <Button
      variant="contained"
      color="primary"
      style={{ marginBottom: '10px' }}
      onClick={handleAddStaffOpen}
    >
      Bổ sung cán bộ
    </Button>
  </>
);

// StaffTable component
const StaffTable = ({ staffList, handleEditOpen, handleDelete }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>TT</TableCell>
          <TableCell>Tên cán bộ</TableCell>
          <TableCell>Đường dẫn</TableCell>
          <TableCell>Chức năng</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {staffList.map((staff, index) => (
          <TableRow key={staff._id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{staff.fullname}</TableCell>
            <TableCell>
              <a href={staff.url} target="_blank" rel="noopener noreferrer">{staff.url}</a>
            </TableCell>
            <TableCell>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditOpen(staff)}
                style={{ marginRight: '10px' }}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(staff._id)}
              >
                Xoá
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

// EditDialog component
const EditDialog = ({ openEdit, selectedStaff, handleDialogClose, handleSaveEdit, handleInputChangeEdit, editStaffDialog }) => (

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
const AddDialog = ({ openAdd, addStaffDialog, handleDialogClose, handleSaveAdd, handleInputChange, }) => (
  <Dialog open={openAdd} onClose={handleDialogClose}>
    <DialogTitle>Thêm người mới</DialogTitle>
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
        name="profile_name"
        label="Tên facebook"
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

export default StaffList;
