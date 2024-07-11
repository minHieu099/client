import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Thống kê',
    path: '/',
    icon: icon('stats'),
  },
  {
    title: 'Đơn vị trực thuộc',
    path: '/dvtt',
    icon: icon('organization'),
  },
  {
    title: 'kiểm tra bài viết',
    path: '/checkpost',
    icon: icon('job'),
  },
  {
    title: 'kiểm tra trang',
    path: '/checkpages',
    icon: icon('job'),
  },
  {
    title: 'kiểm tra định kỳ',
    path: '/scheduled',
    icon: icon('job'),
  },
  {
    title: 'tài khoản',
    path: '/user',
    icon: icon('users'),
  },
  {
    title: 'Biểu đồ',
    path: '/chart',
    icon: icon('chart'),
  }
];

export default navConfig;
