import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Paper, TableRow, TableBody, TableCell, TableHead, TableContainer, TableSortLabel } from '@mui/material';

DisplayTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            chuatuongtac: PropTypes.arrayOf(PropTypes.string).isRequired,
            datuongtac: PropTypes.arrayOf(PropTypes.string).isRequired,
            thongke: PropTypes.object.isRequired,
            tongtuongtac: PropTypes.number.isRequired,
            tongtuongtacdonvi: PropTypes.number.isRequired,
            phantramdonvi: PropTypes.number.isRequired,
            tongtuongtackhongthuocdonvi: PropTypes.number.isRequired,
            phantramnguoingoai: PropTypes.number.isRequired,
            tongcamxuc: PropTypes.number.isRequired,
            tongbinhluan: PropTypes.number.isRequired,
            tongchiase: PropTypes.number.isRequired,
            tongdiem: PropTypes.number.isRequired
        })
    ).isRequired
};

export default function DisplayTable({ data }) {
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; // Đảo hướng sắp xếp
        setSortOrder(newSortOrder);
    };

    // Sắp xếp dữ liệu theo hướng sắp xếp và cập nhật state
    const sortedData = [...data].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.tongdiem - b.tongdiem;
        } else {
            return b.tongdiem - a.tongdiem;
        }
    });

    return (
        <TableContainer component={Paper}>
            <h2>Thống kê bài viết</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>TT</TableCell>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={true}
                                direction={sortOrder}
                                onClick={handleSort}
                            >
                                Số lượng cảm xúc
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={true}
                                direction={sortOrder}
                                onClick={handleSort}
                            >
                                Số lượng bình luận
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={true}
                                direction={sortOrder}
                                onClick={handleSort}
                            >
                                Số lượng chia sẽ
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>
                            <TableSortLabel
                                active={true}
                                direction={sortOrder}
                                onClick={handleSort}
                            >
                                Điểm bài viết
                            </TableSortLabel>
                        </TableCell>
                        <TableCell>Tổng số lượng tương tác</TableCell>
                        <TableCell>Tương tác thuộc đơn vị (%)</TableCell>
                        <TableCell>Tương tác không thuộc đơn vị (%)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (sortedData.map((item, index) => (
                        <React.Fragment key={index}>
                            <TableRow>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.tongcamxuc}</TableCell>
                                <TableCell>{item.tongbinhluan}</TableCell>
                                <TableCell>{item.tongchiase}</TableCell>
                                <TableCell>{item.tongdiem}</TableCell>
                                <TableCell>{item.tongtuongtac}</TableCell>
                                <TableCell>{item.tongtuongtacdonvi}({item.phantramdonvi}%)</TableCell>
                                <TableCell>{item.tongtuongtackhongthuocdonvi}({item.phantramnguoingoai}%)</TableCell>
                            </TableRow>
                        </React.Fragment>
                    )))}
                </TableBody>
            </Table>
            <h2>Thống kê tương tác theo đơn vị</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>TT</TableCell>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Số lượng cán bộ tương tác</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (
                        data.map((item, index) => (
                            Object.entries(item.thongke).map(([donvi, soluong], idx) => (
                                <TableRow key={`${index}-${idx}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{donvi}</TableCell>
                                    <TableCell>{soluong}</TableCell>
                                </TableRow>
                            ))
                        ))
                    )}
                </TableBody>
            </Table>
            <h2>Danh sách cán bộ đã tương tác</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>Tên tài khoản</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Đường dẫn tài khoản</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (data.map((item, index) => (
                        item.datuongtac.map((datuongtacItem, idx) => {
                            const [donvi, hoten, url] = datuongtacItem.match(/\[(.*?)\]\s(.*?)\s\((.*)\)/).slice(1, 4);
                            return (
                                <TableRow key={`${index}-${idx}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hoten}</TableCell>
                                    <TableCell>{donvi}</TableCell>
                                    <TableCell>
                                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )))}
                </TableBody>
            </Table>
            <h2>Danh sách cán bộ chưa tương tác</h2>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Bài viết</TableCell>
                        <TableCell>Tên tài khoản</TableCell>
                        <TableCell>Đơn vị</TableCell>
                        <TableCell>Đường dẫn tài khoản</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                        </TableRow>
                    ) : (data.map((item, index) => (
                        item.chuatuongtac.map((chuatuongtacItem, idx) => {
                            const [donvi, hoten, url] = chuatuongtacItem.match(/\[(.*?)\]\s(.*?)\s\((.*)\)/).slice(1, 4);
                            return (
                                <TableRow key={`${index}-${idx}`}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{hoten}</TableCell>
                                    <TableCell>{donvi}</TableCell>
                                    <TableCell>
                                        <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
