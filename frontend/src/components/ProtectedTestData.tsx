import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import { TestData } from "../types/test";
import { CreateEntryForm } from "./CreateEntryForm";
import { DynamicTable } from "./DynamicTable";

const ProtectedTestData = () => {
  const [data, setData] = useState<TestData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProtectedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: protectedData, error } = await supabase
        .from("protected_data")
        .select("*");

      if (error) throw error;
      setData(protectedData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "200px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <CreateEntryForm onSuccess={fetchProtectedData} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: "1000px", margin: "0 auto" }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Protected Test Data
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        This data is only accessible to authenticated users.
      </Typography>

      <Box mb={4}>
        <CreateEntryForm onSuccess={fetchProtectedData} />
      </Box>

      {data.length > 0 ? (
        <DynamicTable data={data} />
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No protected data available. Please create some entries.
        </Typography>
      )}
    </Box>
  );
};

export default ProtectedTestData;
