import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { videoAPI } from '../services/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [tab, setTab] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      const response = await videoAPI.search(query);
      return response.data;
    },
    enabled: !!query,
  });

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
        搜索结果: {query}
      </Typography>

      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="视频" />
        <Tab label="用户" />
      </Tabs>

      {isLoading ? (
        <Typography>搜索中...</Typography>
      ) : (
        <Grid container spacing={2}>
          {data?.results?.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              {/* 使用VideoCard组件 */}
              <Box>{item.title}</Box>
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && (!data?.results || data.results.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            未找到相关结果
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Search;
