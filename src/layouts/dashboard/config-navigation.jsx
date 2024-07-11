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
    title: 'Phân tích',
    path: '/chart',
    icon: icon('chart'),
  },
  {
    title: 'Đơn vị trực thuộc',
    path: '/dvtt',
    icon: icon('organization'),
  },
  {
    title: 'kiểm tra trang',
    path: '/checkpages',
    icon: icon('pages'),
  },
  {
    title: 'kiểm tra bài viết',
    path: '/checkpost',
    icon: icon('article'),
  },
  {
    title: 'kiểm tra định kỳ',
    path: '/scheduled',
    icon: icon('schedule'),
  },
  {
    title: 'tài khoản',
    path: '/user',
    icon: icon('users'),
  }
];

export default navConfig;
