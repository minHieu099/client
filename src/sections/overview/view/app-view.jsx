
import { getFullname } from 'src/routes/auth';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import PointInWeek from '../point-in-week';
import PostInDay from '../app-current-visits';
import PostInWeek from '../app-website-visits';
import PageFollowers from '../app-conversion-rates';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Xin chào, {getFullname()} 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Đơn vị trực thuộc"
            total={4}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tài khoản Facebook"
            total={150000}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Kênh truyền thông"
            total={30}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lượt theo dõi"
            total={1560000}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <PostInWeek
            title="Hoạt động trong tuần (tin bài)"
            subheader="(+43%) so với tuần trước"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
                '12/01/2024',
              ],
              series: [
                {
                  name: 'Cụm 21',
                  type: 'area',
                  fill: 'gradient',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 40],
                },
                {
                  name: 'Cụm 22',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 50],
                },
                {
                  name: 'Cụm 23',
                  type: 'area',
                  fill: 'gradient',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 60],
                },
                {
                  name: 'Khối cơ quan',
                  type: 'area',
                  fill: 'gradient',
                  data: [5, 10, 12, 14, 16, 20, 28, 20, 15, 10, 19, 10],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PostInDay
            title="Hoạt động trong ngày"
            chart={{
              series: [
                { label: 'Cụm 21', value: 2 },
                { label: 'Cụm 22', value: 20 },
                { label: 'Cụm 23', value: 2 },
                { label: 'Khối cơ quan', value: 6 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <PointInWeek
            title="Đánh giá trong tuần (điểm)"
            subheader="(+43%) so với tuần trước"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
                '12/01/2024',
              ],
              series: [
                {
                  name: 'Cụm 21',
                  type: 'area',
                  fill: 'gradient',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 40],
                },
                {
                  name: 'Cụm 22',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 50],
                },
                {
                  name: 'Cụm 23',
                  type: 'area',
                  fill: 'gradient',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 60],
                },
                {
                  name: 'Khối cơ quan',
                  type: 'area',
                  fill: 'gradient',
                  data: [5, 10, 12, 14, 16, 20, 28, 20, 15, 10, 19, 10],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <PageFollowers
            title="Lượt theo dõi của các kênh truyền thông nổi bật"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
