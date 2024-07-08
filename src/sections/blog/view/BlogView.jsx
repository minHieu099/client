import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { getToken } from 'src/routes/auth';
import Iconify from 'src/components/iconify';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  textAlign: 'center',
}));

const StyledTableHeaderCell = styled(StyledTableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.common.white,
  color: theme.palette.common.black,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

function BlogView() {
  const [unitData, setUnitData] = useState([]);
  const [error, setError] = useState(null);
  const token = getToken();
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.3.101:19999/api/teams',
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setUnitData(response.data);
      setError(null); // Clear any previous error if fetch succeeds
    } catch (error) {
      console.error('Error fetching unit data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [openDialogAdd, setOpenDialogAdd] = useState(false)
  const [addDV, setAddDV] = useState({
    name: ''
  })
  const OpenDialogAdd = () => {
    setOpenDialogAdd(true)
  }
  const closeDialogAdd = () => {
    setOpenDialogAdd(false)
  }
  //input đơn vị
  const InputDonVi = (e) => {
    const { name, value } = e.target;
    setAddDV(prev => ({
      ...prev,
      [name]: value,
    }))
  }
  //thêm đơn vị mới 
  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy token từ nơi nào đó
      const response = await axios.post(
        'http://192.168.3.101:19999/api/teams/new',
        addDV,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      handleShowToast('Thêm thành công!', 'success');
      closeDialogAdd();
    } catch (error) {
      setError(error.message);
      handleShowToast('Thêm thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  }

  //sửa
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
  const [editDvSelect, setEditDvSelect] = useState(null)
  const [eidtDV, setEditDV] = useState({
    team_id: '',
    new_info: {
      name: ''
    }
  })
  const OpenDialogEdit = (dv) => {
    setEditDvSelect(dv);
    setEditDV({
      team_id: dv._id,
      new_info: {
        name: dv.name
      }
    })
    setOpenDialogEdit(true);
  }
  const CloseDialogEdit = () => {
    setOpenDialogEdit(false);
  }
  const InputChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditDV(prev => ({
      ...prev,
      new_info: {
        ...prev.new_info,
        [name]: value
      }
    }));
  }
  const EditSave = async () => {
    try {
      await axios.put(
        'http://192.168.3.101:19999/api/teams/update',
        eidtDV,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
      handleShowToast('Sửa thành công!', 'success');
      CloseDialogEdit();
    } catch (error) {
      setError(error.message);
      handleShowToast('Sửa thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  //xoá đơn vị
  const [openDialogDelete, setOpenDialogDelete] = useState(false)
  const [idDel, setIdDel] = useState(null)
  const OpenDialogDel = (id) => {
    setIdDel(id)
    setOpenDialogDelete(true)
  }
  const CloseDialogDel = () => {
    setOpenDialogDelete(false)
  }
  const DeleteDV = async () => {
    try {
      await axios.delete(` http://192.168.3.101:19999/api/teams/${idDel}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchData();
      handleShowToast('Xoá thành công!', 'success');
      CloseDialogDel();
    } catch (error) {
      setError(error.message);
      handleShowToast('Xoá thất bại!', 'error');
      CloseDialogDel();
    } finally {
      setLoading(false);
    }
  };

  //thông báo trạng thái
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
      <Typography variant="h4" component="h1" gutterBottom>
        Danh sách đơn vị
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '10px' }}
        onClick={OpenDialogAdd}
      ><Iconify icon="eva:plus-fill" />
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeaderCell>TT</StyledTableHeaderCell>
              <StyledTableHeaderCell>Đơn vị</StyledTableHeaderCell>
              <StyledTableHeaderCell>Danh sách</StyledTableHeaderCell>
              <StyledTableHeaderCell>Chức năng</StyledTableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unitData.map((row, index) => (
              <TableRow key={row._id}>
                <StyledTableCell>{index + 1}</StyledTableCell>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>
                  <Link to={`/dvtt/staff/${row._id}`}>
                    <StyledButton variant="contained" color="primary">
                      Danh sách cán bộ
                    </StyledButton>
                  </Link>
                  <Link to={`/dvtt/pages/${row._id}`}>
                    <Button variant="contained" color="secondary">
                      Danh sách trang
                    </Button>
                  </Link>
                </StyledTableCell>
                <StyledTableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => OpenDialogEdit(row)}
                    style={{ marginRight: '10px' }}
                  ><Iconify icon="eva:edit-fill" />
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => OpenDialogDel(row._id)}
                  ><Iconify icon="eva:trash-2-outline" />
                  </Button>
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <AddDonVi
        openDialogAdd={openDialogAdd}
        closeDialogAdd={closeDialogAdd}
        InputDonVi={InputDonVi}
        handleAdd={handleAdd}
        addDV={addDV}
      ></AddDonVi>

      <EditDonVi
        openDialogEdit={openDialogEdit}
        CloseDialogEdit={CloseDialogEdit}
        InputChangeEdit={InputChangeEdit}
        EditSave={EditSave}
        editDvSelect={editDvSelect}
      ></EditDonVi>

      <DeleteDonVi
        openDialogDelete={openDialogDelete}
        CloseDialogDel={CloseDialogDel}
        DeleteDV={DeleteDV}
      ></DeleteDonVi>

      <Toast
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        severity={toast.severity}
      />

    </Container>
  );
}

const AddDonVi = ({ InputDonVi, openDialogAdd, closeDialogAdd, handleAdd }) => (
  <Dialog open={openDialogAdd} onClose={closeDialogAdd}>
    <DialogTitle>Thêm đơn vị mới</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="name"
        label="Tên đơn vị mới"
        type="text"
        fullWidth
        onChange={(e) => InputDonVi(e)}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={closeDialogAdd} color="primary">
        Hủy
      </Button>
      <Button onClick={handleAdd} color="primary">
        Thêm
      </Button>
    </DialogActions>
  </Dialog>
);

const DeleteDonVi = ({ openDialogDelete, CloseDialogDel, DeleteDV }) => (
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

const EditDonVi = ({ openDialogEdit, CloseDialogEdit, editDvSelect, EditSave, InputChangeEdit }) => (
  <Dialog open={openDialogEdit} onClose={CloseDialogEdit}>
    <DialogTitle>Sửa thông tin đơn vị</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        name="name"
        label="Tên đơn vị"
        type="text"
        fullWidth
        defaultValue={editDvSelect?.name || ''}
        onChange={(e) => InputChangeEdit(e)}
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

export default BlogView;
