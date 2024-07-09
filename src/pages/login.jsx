import { Helmet } from 'react-helmet-async';
import { LoginView } from 'src/sections/login';
import {Box} from "@mui/material"

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Đăng nhập </title>
      </Helmet>
{/* <Box sx={{mt:0, mb:0, textAlign:'center'}}> */}

      <LoginView />
{/* </Box> */}
    </>
  );
}
