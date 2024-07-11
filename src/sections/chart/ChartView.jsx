import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { getToken } from 'src/routes/auth';
import PointInMonth from '../overview/point-in-month';
import PointInWeek from '../overview/point-in-week';
import PostInMonth from '../overview/post-in-month';
import PostInWeek from '../overview/post-in-week';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';

const initialFromDate = new Date(); // Initial start date
const initialUntilDate = new Date(); // Initial end date

function DateSelector({ fromDate, untilDate, handleFromDateChange, handleUntilDateChange, handleFetchData }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', mt: 4, mb: 2, gap: 2 }}>
                <DatePicker
                    label="Chọn ngày bắt đầu"
                    value={fromDate}
                    onChange={handleFromDateChange}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    label="Chọn ngày kết thúc"
                    value={untilDate}
                    onChange={handleUntilDateChange}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} />}
                />
                <Button variant="contained" onClick={handleFetchData}>
                    Tải dữ liệu
                </Button>
            </Box>
        </LocalizationProvider>
    );
}

export default function ChartView() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState(initialFromDate);
    const [untilDate, setUntilDate] = useState(initialUntilDate);

    const handleFromDateChange = (newFromDate) => {
        setFromDate(newFromDate);
    };

    const handleUntilDateChange = (newUntilDate) => {
        setUntilDate(newUntilDate);
    };

    const handleFetchData = () => {
        fetchData();
    };

    const fetchData = async () => {
        const token = getToken();
        const formattedFromDate = fromDate.toISOString().split('T')[0];
        const formattedUntilDate = untilDate.toISOString().split('T')[0];
        const apiEndpoint = `http://192.168.3.101:19999/api/stats/range?from=${formattedFromDate}&until=${formattedUntilDate}`;

        try {
            setLoading(true);
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

    useEffect(() => {
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
            <DateSelector
                fromDate={fromDate}
                untilDate={untilDate}
                handleFromDateChange={handleFromDateChange}
                handleUntilDateChange={handleUntilDateChange}
                handleFetchData={handleFetchData}
            />
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                    <PostInMonth
                        title="Hoạt động trong tháng (tin bài)"
                        subheader="(4 tuần gần nhất)"
                        chart={{
                            labels: data.chart_post_in_range.labels,
                            series: data.chart_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <PostInWeek
                        title="Hoạt động trong tuần"
                        chart={{
                            series: data.chart_dist_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                    <PointInMonth
                        title="Đánh giá trong tháng (điểm)"
                        subheader="(4 tuần gần nhất)"
                        chart={{
                            labels: data.chart_point_in_range.labels,
                            series: data.chart_point_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <PointInWeek
                        title="Đánh giá trong tuần"
                        chart={{
                            series: data.chart_dist_point_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={12}>
                    <PostInMonth
                        title="Hoạt động trong tháng (điểm)"
                        subheader="(4 tuần gần nhất)"
                        chart={{
                            labels: data.chart_team_post_in_range.labels,
                            series: data.chart_team_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={12}>
                    <PointInMonth
                        title="Đánh giá trong tháng (điểm)"
                        subheader="(4 tuần gần nhất)"
                        chart={{
                            labels: data.chart_team_point_in_range.labels,
                            series: data.chart_team_point_in_range.series,
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
