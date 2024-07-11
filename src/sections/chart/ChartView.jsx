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
import { format } from 'date-fns';

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
    const formattedFromDateDisplay = format(fromDate, 'dd/MM/yyyy');
    const formattedUntilDateDisplay = format(untilDate, 'dd/MM/yyyy');
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
                        title="Số lượng tin bài"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
                        chart={{
                            labels: data.chart_post_in_range.labels,
                            series: data.chart_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <PostInWeek
                        title="Phân bổ theo đơn vị"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
                        chart={{
                            series: data.chart_dist_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                    <PointInMonth
                        title="Đánh giá chất lượng (điểm)"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
                        chart={{
                            labels: data.chart_point_in_range.labels,
                            series: data.chart_point_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={4}>
                    <PointInWeek
                        title="Phân bổ theo đơn vị"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
                        chart={{
                            series: data.chart_dist_point_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={12}>
                    <PostInMonth
                        title="Hoạt động của các đơn vị (tin bài)"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
                        chart={{
                            labels: data.chart_team_post_in_range.labels,
                            series: data.chart_team_post_in_range.series,
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={12}>
                    <PointInMonth
                        title="Đánh giá chất lượng các đơn vị (điểm)"
                        subheader={`${formattedFromDateDisplay} - ${formattedUntilDateDisplay}`}
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
