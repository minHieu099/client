import Label from 'src/components/label';
import { Alert, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Snackbar, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { getToken } from 'src/routes/auth';
import { useRouter } from 'src/routes/hooks';
import Stack from '@mui/material/Stack';
import styled from 'styled-components';

const CustomContainer = styled(Container)({
    textAlign: 'center',
    maxWidth: '1200px',
    margin: '50px auto',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  });

function PageList() {
    const { id } = useParams();
    const token = getToken();
    const [pageData, setPageData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [openDialogAdd, setOpenDialogAdd] = useState(false)
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const [addPage, setAddPage] = useState({
        team_id: id,
        name: '',
        url: '',
        prioritized: false,
    })
    const [editPage, setEditPage] = useState({
        page_id: '',
        new_info: {
            name: '',
        },
    })
    const fetchPages = async () => {
        try {
            const response = await axios.get(`http://192.168.3.101:19999/api/teams/${id}/pages`,
                { headers: { Authorization: `Bearer ${getToken()}` } });
            setPageData(response.data);

            const initState = response.data.map(item => ({
                _id: item._id,
                prioritized: item.prioritized == true
            }))
            setStates(initState)
        } catch (error) {
            console.error('Lỗi:', error);
            setError('Tải dữ liệu thất bại, vui lòng thử lại sau.');
        }
    };
    //hiển thị dữ liệu
    useEffect(() => {
        fetchPages();
    }, [id]);

    //toggle bật tắt
    const [states, setStates] = useState([]);
    const OnOff = async (id) => {
        const updatedStates = states.map(row => {
            if (row._id === id) {
                return {
                    ...row,
                    prioritized: !row.prioritized
                }
            }
            return row;
        })
        // Cập nhật trạng thái trong React state trước
        setStates(updatedStates);

        const updatedRow = updatedStates.find(row => row._id === id);
        try {
            // Gửi yêu cầu PUT tới server
            const response = await axios.put(`http://192.168.3.101:19999/api/pages/update/priority`, {
                page_id: updatedRow._id,
                prioritized: updatedRow.prioritized
            }, { headers: { Authorization: `Bearer ${getToken()}` } });

            if (response.status !== 200) {
                throw new Error('Lỗi khi cập nhật dữ liệu trên server');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            // Khôi phục lại trạng thái ban đầu nếu có lỗi xảy ra
            setStates(states);
        }
    }
    //open dialog add page
    const dialogAddPage = () => {
        setOpenDialogAdd(true)
    }
    //nhập giá trị bổ sung trang
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddPage(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleDialogClose = () => {
        setOpenDialogAdd(false)
    }
    //xử lý lưu trang mới
    const handleSaveAdd = async () => {
        setLoading(true);
        setError(null);
        try {
            // Lấy token từ nơi nào đó
            const response = await axios.post(
                'http://192.168.3.101:19999/api/pages/new',
                [addPage],
                { headers: { Authorization: `Bearer ${token}` } }
            );
            handleShowToast('Thêm thành công!', 'success');
            fetchPages();
            handleDialogClose();
        } catch (error) {
            handleShowToast('Thêm thất bại!', 'error');
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    //sửa thông tin trang
    const handleEditPage = (page) => {
        setSelectedPage(page)
        setEditPage({
            page_id: page._id,
            new_info: {
                name: page.name,
                url: page.url,
                prioritized: false,
            }
        })
        setOpenEdit(true)
    }
    const closeEditDialog = () => {
        setOpenEdit(false)
    }
    const handleInputChangeEdit = (page) => {
        const { name, value } = page.target;
        setEditPage(prevState => ({
            ...prevState,
            new_info: {
                ...prevState.new_info,
                [name]: value
            }
        }));
    }
    const handleSaveEdit = async () => {
        try {
            await axios.put(
                'http://192.168.3.101:19999/api/pages/update',
                editPage,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            handleShowToast('Sửa thành công!', 'success');
            fetchPages();
            closeEditDialog();
        } catch (error) {
            setError(error.message);
            handleShowToast('Sửa thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const [confirmDelete, setConfirmDelete] = useState(false)
    const [idDelete, setIdDelete] = useState(null);
    //mở dialog confirm delete
    const dialogConfirmDelete = (page) => {
        setIdDelete(page)
        setConfirmDelete(true)
    }
    const handleDialogDeleteClose = () => {
        setConfirmDelete(false)
    }
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://192.168.3.101:19999/api/pages/${idDelete}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            fetchPages();
            handleShowToast('Xoá thành công!', 'success');
            handleDialogDeleteClose();
        } catch (error) {
            handleShowToast('Xoá thất bại!', 'error');
            console.error('Error deleting page:', error);
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
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                Kênh truyền thông
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginBottom: '10px' }}
                    startIcon={<Iconify icon="eva:plus-fill" />}
                    onClick={dialogAddPage}
                >Thêm
                </Button>

            </Stack>

            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ width: '5%' }}>STT</TableCell>
                            <TableCell align="center" style={{ width: '10%' }}>Đơn vị</TableCell>
                            <TableCell align="center" style={{ width: '15%' }}>Tên trang</TableCell>
                            <TableCell align="center" style={{ width: '30%' }}>Đường dẫn</TableCell>
                            <TableCell align="center" style={{ width: '10%' }}>Giám sát</TableCell>
                            <TableCell align="center" style={{ width: '30%' }}>Chức năng</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pageData.map((row, index) => (
                            <TableRow key={row._id}>
                                <TableCell align="center">{index + 1}</TableCell>
                                
                                <TableCell align="center"><Label color={'success'}>{row.team}</Label></TableCell>
                                <TableCell align="center">{row.name}</TableCell>
                                <TableCell><a href={row.url} target="_blank" rel="noopener noreferrer">{row.url}</a></TableCell>
                                <TableCell align="center">
                                    {/* <Chip
                                        label={states[index].prioritized ? "Ưu tiên" : "Không ưu tiên"}
                                        color={states[index].prioritized ? 'primary' : 'default'}
                                        variant="outlined"
                                        sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}
                                    /> */}
                                    
                                    <Switch
                                        checked={states[index]?.prioritized}
                                        onChange={() => OnOff(row._id)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                    
                                    
                                </TableCell>
                                <TableCell align="center">
                                    
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEditPage(row)}
                                        style={{ marginRight: '10px' }}
                                    ><Iconify icon="eva:edit-fill" />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => dialogConfirmDelete(row._id)}
                                    ><Iconify icon="eva:trash-2-outline" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <DialogAddPage
                openDialogAdd={openDialogAdd}
                handleInputChange={handleInputChange}
                handleDialogClose={handleDialogClose}
                handleSaveAdd={handleSaveAdd}
                addPage={addPage}
            ></DialogAddPage>

            <DialogDelete
                confirmDelete={confirmDelete}
                handleConfirmDelete={handleConfirmDelete}
                handleDialogDeleteClose={handleDialogDeleteClose}
            ></DialogDelete>

            <DialogEdit
                openEdit={openEdit}
                closeEditDialog={closeEditDialog}
                handleSaveEdit={handleSaveEdit}
                selectedPage={selectedPage}
                handleInputChangeEdit={handleInputChangeEdit}
            ></DialogEdit>

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

const DialogAddPage = ({ openDialogAdd, handleDialogClose, handleSaveAdd, handleInputChange, }) => (
    <Dialog open={openDialogAdd} onClose={handleDialogClose}>
        <DialogTitle>Thêm trang mới</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Tên trang mới"
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
const DialogEdit = ({ openEdit, closeEditDialog, handleInputChangeEdit, handleSaveEdit, selectedPage }) => (
    <Dialog open={openEdit} onClose={closeEditDialog}>
        <DialogTitle>Sửa thông tin trang</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Tên trang"
                type="text"
                fullWidth
                defaultValue={selectedPage?.name || ''}
                onChange={(e) => handleInputChangeEdit(e)}
            />
            <TextField
                margin="dense"
                name="url"
                label="Đường dẫn"
                type="text"
                fullWidth
                defaultValue={selectedPage?.url || ''}
                onChange={(e) => handleInputChangeEdit(e)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={closeEditDialog} color="primary">
                Hủy
            </Button>
            <Button onClick={handleSaveEdit} color="primary">
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

export default PageList;
