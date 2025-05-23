import { Alert, Box, Paper, Typography, Divider } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchTestData,
  selectTestData,
  selectTestError,
} from "../store/slices/testSlice";
import { DynamicTable } from "./DynamicTable";

export const TestData = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectTestData);
  const error = useAppSelector(selectTestError);

  useEffect(() => {
    dispatch(fetchTestData());
  }, [dispatch]);

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Alert severity="error" variant="outlined" sx={{ fontWeight: 'medium' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Test Data
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Status: <Box component="span" fontWeight="medium" color="success.main">Connected</Box> | Last Updated:{" "}
          <Box component="span" fontWeight="medium">
            {new Date().toLocaleString()}
          </Box>
        </Typography>

        {data.length > 0 ? (
          <Box sx={{ mt: 3 }}>
            <DynamicTable data={data} />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" mt={5}>
            No data available at this time.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};
