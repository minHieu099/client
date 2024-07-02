import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import axios from 'axios';
import { getUsername, login, setUsername } from '../../routes/auth';
import { Navigate, useNavigate } from 'react-router-dom';
// ----------------------------------------------------------------------

export default function LoginView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.3.101:19999/api/users/login', credentials);
      const {token, username, fullname} = response.data
      login(token, username, fullname);
      router.push('/');
      // navigate('/', { state: { username: username , fullname:fullname} });
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>

        <TextField
          name="username"
          label="Nhập tài khoản"
          value={credentials.username}
          onChange={handleChange}
        />

        <TextField
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          value={credentials.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={loading}
      >
        Login
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Đăng nhập</Typography>

          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}