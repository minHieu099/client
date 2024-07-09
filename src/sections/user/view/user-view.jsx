import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Scrollbar from 'src/components/scrollbar';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { getToken } from 'src/routes/auth';
import axios from 'axios';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState(null);
  const token = getToken();
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState([]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: userProfile,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.3.101:19999/api/users/volunteers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data);
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
    id_donvi: '',
    fullname: '',
    username: '',
    password: '',
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
    setAddDV({
      ...addDV,
      [name]: value,
    });
  }
  //thêm đơn vị mới 
  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        'http://192.168.3.101:19999/api/users/volunteers/new',
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

  //chọn đơn vị
  const [donViList, setDonViList] = useState([]);
  useEffect(() => {
    const fetchDonViList = async () => {
      try {
        const response = await axios.get('http://192.168.3.101:19999/api/teams', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonViList(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đơn vị:', error);
      }
    };

    fetchDonViList();
  }, [token]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Danh sách cộng tác viên</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={OpenDialogAdd}
        >
          Thêm tài khoản
        </Button>
      </Stack>

      <Card>
        {/* <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
        /> */}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={userProfile.length}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'stt', label: 'Thứ tự' },
                  { id: 'name', label: 'Tài khoản' },
                  { id: 'fullname', label: 'Họ tên' },
                  { id: 'role', label: 'Vai trò' },
                  { id: 'status', label: 'Đơn vị' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <UserTableRow
                      key={row._id}
                      id_del={row._id}
                      stt={index + 1}
                      name={row.username}
                      role={row.role}
                      status={row.donvi}
                      company={row.fullname}
                      avatarUrl={row.avatarUrl}
                      fetchData={fetchData}
                      handleShowToast={handleShowToast}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, userProfile.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={userProfile.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <AddUser
        openDialogAdd={openDialogAdd}
        closeDialogAdd={closeDialogAdd}
        InputDonVi={InputDonVi}
        handleAdd={handleAdd}
        addDV={addDV}
        donViList={donViList}
      ></AddUser>

      <Toast
        open={toast.open}
        onClose={handleCloseToast}
        message={toast.message}
        severity={toast.severity}
      />
    </Container>
  );
}

const AddUser = ({ InputDonVi, openDialogAdd, closeDialogAdd, handleAdd, donViList, addDV }) => (
  <Dialog open={openDialogAdd} onClose={closeDialogAdd}>
    <DialogTitle>Thêm tài khoản mới</DialogTitle>
    <DialogContent>
      <FormControl fullWidth margin="dense">
        <InputLabel>Chọn đơn vị</InputLabel>
        <Select
          name="id_donvi"
          label="Chọn Đơn vị"
          value={addDV.id_donvi}
          onChange={(e) => InputDonVi(e)}
        >
          {donViList.map((donVi) => (
            <MenuItem key={donVi._id} value={donVi._id}>
              {donVi.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        margin="dense"
        name="fullname"
        label="Họ và tên"
        type="text"
        fullWidth
        value={addDV.fullname}
        onChange={(e) => InputDonVi(e)}
      />
      <TextField
        margin="dense"
        name="username"
        label="Tên người dùng"
        type="text"
        fullWidth
        value={addDV.username} 
        onChange={(e) => InputDonVi(e)}
      />
      <TextField
        margin="dense"
        name="password"
        label="Mật khẩu"
        type="password"
        fullWidth
        value={addDV.password}
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