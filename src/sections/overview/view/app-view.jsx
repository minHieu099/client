import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import PointInMonth from '../point-in-month';
import PointInWeek from '../point-in-week';
import PostInWeek from '../post-in-week';
import PostInMonth from '../post-in-month';
import PageFollowers from '../page-follower';
import AppWidgetSummary from '../app-widget-summary';
import { getFullname, getToken } from 'src/routes/auth';
import label from 'src/components/label';

const apiEndpoint = 'http://192.168.3.101:19999/api/stats';
const token = getToken();

export default function AppView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   axios.get(apiEndpoint, {
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   })
  //     .then(response => {
  //       setData(response.data);
  //       setLoading(false);
  //     })
  //     .catch(error => {
  //       setError(error);
  //       setLoading(false);
  //     });
  // }, []);

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
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (
    <Container maxWidth="xl">


      <Typography variant="h5" sx={{ mb: 5 }}>
        {data.committee_data.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Đơn vị trực thuộc"
            total={data.committee_data.teams}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Tài khoản Facebook"
            total={data.committee_data.profiles}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Kênh truyền thông"
            total={data.committee_data.pages}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Số lượng theo dõi"
            total={data.committee_data.followers}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <PostInMonth
            title="Hoạt động trong tháng (tin bài)"
            subheader="(+43%) so với tháng trước"
            chart={{
              labels: data.chart_post_in_month.labels,
              series: data.chart_post_in_month.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PostInWeek
            title="Hoạt động trong tuần"
            chart={{
              series: data.chart_post_in_week.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <PointInMonth
            title="Đánh giá trong tháng (điểm)"
            subheader="(+43%) so với tháng trước"
            chart={{
              labels: data.chart_point_in_month.labels,
              series: data.chart_point_in_month.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <PointInWeek
            title="Đánh giá trong tuần"
            chart={{
              series: data.chart_point_in_week.series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <PageFollowers
            title="Lượt theo dõi của các kênh truyền thông nổi bật"
            subheader="(+43%) than last year"
            chart={{
              series: data.top_pages.series,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
