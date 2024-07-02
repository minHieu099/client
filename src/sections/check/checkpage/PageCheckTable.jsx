import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Menu,
  MenuItem,
  Checkbox,
} from '@mui/material';

export default function PageCheckTable() {
  const [rows, setRows] = useState([
    { id: 1, stt: 1, name: 'Trang 1', url: 'https://example.com/page1', unit: 'A', checked: false },
    { id: 2, stt: 2, name: 'Trang 2', url: 'https://example.com/page2', unit: 'A', checked: false },
    { id: 3, stt: 3, name: 'Trang 3', url: 'https://example.com/page3', unit: 'B', checked: false },
    { id: 4, stt: 4, name: 'Trang 4', url: 'https://example.com/page4', unit: 'B', checked: false },
    { id: 5, stt: 5, name: 'Trang 5', url: 'https://example.com/page5', unit: 'C', checked: false },
  ]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelectAllClick = (event) => {
    const newCheckedState = event.target.checked;
    const newRows = rows.map((row) => ({ ...row, checked: newCheckedState }));
    setRows(newRows);
  };

  const handleCheckboxClick = (event, id) => {
    const newRows = rows.map((row) => row.id === id ? { ...row, checked: event.target.checked } : row);
    setRows(newRows);
  };

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setAnchorEl(null);
  };

  const handleCheckButtonClick = () => {
    const selectedPages = rows.filter(row => row.checked);
    console.log('Kiểm tra trang:', selectedPages);
  };

  return (
    <Box mt={4} sx={{ textAlign: 'center' }}>
      <Box display="inline-block" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ mr: 1 }}
        >
          Chọn đơn vị kiểm tra
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleUnitSelect(null)}>Tất cả</MenuItem>
          {Array.from(new Set(rows.map((row) => row.unit))).map((unit) => (
            <MenuItem key={unit} onClick={() => handleUnitSelect(unit)}>
              Đơn vị {unit}
            </MenuItem>
          ))}
        </Menu>
      </Box>
      <Box display="inline-block">
        <Button variant="contained" color="secondary" onClick={handleCheckButtonClick}>
          Kiểm tra
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">STT</TableCell>
              <TableCell align="center" sx={{ width: 200 }}>
                Chọn trang
                <Checkbox
                  indeterminate={rows.some((row) => row.checked) && !rows.every((row) => row.checked)}
                  checked={rows.every((row) => row.checked)}
                  onChange={handleSelectAllClick}
                  sx={{ ml: 1 }}
                />
              </TableCell>
              <TableCell align="center" sx={{ width: 250 }}>Tên trang</TableCell>
              <TableCell align="center">Đường dẫn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(
              (row) =>
                (selectedUnit === null || row.unit === selectedUnit) && (
                  <TableRow key={row.id}>
                    <TableCell align="center">{row.stt}</TableCell>
                    <TableCell align="center" padding="checkbox">
                      <Checkbox
                        checked={row.checked}
                        onChange={(event) => handleCheckboxClick(event, row.id)}
                      />
                    </TableCell>
                    <TableCell align="center">{row.name}</TableCell>
                    <TableCell align="center">
                      <a href={row.url} target="_blank" rel="noopener noreferrer">
                        {row.url}
                      </a>
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
