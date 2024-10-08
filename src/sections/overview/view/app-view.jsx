import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Stack from '@mui/material/Stack';
import Iconify from 'src/components/iconify';
import { getToken } from 'src/routes/auth';
import AppWidgetSummary from '../app-widget-summary';
import PageFollowers from '../page-follower';
import PointInMonth from '../point-in-month';
import PointInWeek from '../point-in-week';
import PostInMonth from '../post-in-month';
import PostInWeek from '../post-in-week';

const apiEndpoint = 'http://192.168.3.101:19999/api/stats';

export default function AppView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        const response = await axios.get(apiEndpoint, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Typography>Đang tải dữ liệu ...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Container maxWidth="xl">

      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
        <Iconify icon="noto:star" sx={{ width: 40, height: 40 }} />
        <Typography variant="h5" sx={{ color: '#7D7B79' }}>
          {data.committee_data.name}
        </Typography>
      </Stack>



      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Đơn vị trực thuộc"
            total={data.committee_data.teams}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/organization-chart.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tài khoản Facebook"
            total={data.committee_data.profiles}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/verified.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Kênh truyền thông"
            total={data.committee_data.pages}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/social-media.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lượt theo dõi"
            total={data.committee_data.followers}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/rating.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <PostInMonth
            title={`Hoạt động trong tháng: ${data.total_post_in_month} tin bài`}
            subheader="(4 tuần gần nhất)"
            chart={{
              labels: data.chart_post_in_month.labels,
              series: data.chart_post_in_month.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PostInWeek
            title={`Hoạt động trong tuần: ${data.total_post_in_week} tin bài`}
            chart={{
              series: data.chart_post_in_week.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <PointInMonth
            title={`Đánh giá trong tháng (điểm): ${data.total_react_in_month} lượt tương tác`}
            subheader="(4 tuần gần nhất)"
            chart={{
              labels: data.chart_point_in_month.labels,
              series: data.chart_point_in_month.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PointInWeek
            title={`Đánh giá trong tuần (điểm): ${data.total_react_in_week} lượt tương tác`}
            chart={{
              series: data.chart_point_in_week.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <PageFollowers
            title="Lượt theo dõi của các kênh truyền thông nổi bật"
            subheader=""
            chart={{
              series: data.top_pages.series,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
