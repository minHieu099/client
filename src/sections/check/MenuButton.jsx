import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function MenuButton({ setSelectedMenuItem }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (type) => {
        setSelectedMenuItem(type);
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleMenuOpen}
                aria-controls="menu"
                aria-haspopup="true"
            >
                Chọn phương thức kiểm tra
            </Button>
            <Menu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleMenuItemClick('post')}>
                    Kiểm tra bài viết
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('page')}>
                    Kiểm tra trang
                </MenuItem>
            </Menu>
        </>
    );
}
