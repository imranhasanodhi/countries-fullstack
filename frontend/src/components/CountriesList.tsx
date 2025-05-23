import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Chip,
  CircularProgress,
  Fade,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllCountries,
  selectAllCountries,
  selectCountriesError,
  selectCountriesLoading,
} from "../store/slices/countriesSlice";
import CountryCard from "./CountryCard";

const CountriesList = () => {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectAllCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);
  const theme = useTheme();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [filteredCountries, setFilteredCountries] = useState(countries);

  // Unique regions sorted alphabetically
  const regions = [...new Set(countries.map((c) => c.region))].sort();

  useEffect(() => {
    if (countries.length === 0) {
      dispatch(fetchAllCountries());
    }
  }, [dispatch, countries.length]);

  useEffect(() => {
    let result = countries;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (country) =>
          country.name.common.toLowerCase().includes(lowerSearch) ||
          (country.capital &&
            country.capital[0].toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedRegion) {
      result = result.filter((country) => country.region === selectedRegion);
    }

    setFilteredCountries(result);
  }, [countries, searchTerm, selectedRegion]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (e: SelectChangeEvent<string>) => {
    setSelectedRegion(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("");
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress size={36} thickness={5} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} textAlign="center">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={700}>
      <Box px={{ xs: 2, sm: 4, md: 6 }} py={4} maxWidth="1280px" mx="auto">
        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          sx={{ letterSpacing: "0.06em", color: theme.palette.text.primary }}
        >
          Countries of the World
        </Typography>

        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 5,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { md: "center" },
              mb: 1.5,
            }}
          >
            <TextField
              fullWidth
              label="Search countries"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by country name or capital"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: theme.palette.action.hover,
                  borderRadius: 1.5,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontSize: "1rem",
                  fontWeight: 500,
                },
              }}
            />

            <FormControl
              variant="outlined"
              size="medium"
              sx={{
                minWidth: 220,
                bgcolor: theme.palette.action.hover,
                borderRadius: 1.5,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                },
              }}
            >
              <InputLabel id="region-select-label" sx={{ fontWeight: 600 }}>
                Filter by Region
              </InputLabel>
              <Select
                labelId="region-select-label"
                value={selectedRegion}
                onChange={handleRegionChange}
                label="Filter by Region"
                startAdornment={
                  <InputAdornment position="start" sx={{ color: "text.secondary" }}>
                    <FilterListIcon />
                  </InputAdornment>
                }
                sx={{
                  fontWeight: 600,
                }}
              >
                <MenuItem value="">
                  <em>All Regions</em>
                </MenuItem>
                {regions.map((region) => (
                  <MenuItem key={region} value={region}>
                    {region}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {(searchTerm || selectedRegion) && (
            <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                Active filters:
              </Typography>
              {searchTerm && (
                <Chip
                  label={`Search: ${searchTerm}`}
                  onDelete={() => setSearchTerm("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {selectedRegion && (
                <Chip
                  label={`Region: ${selectedRegion}`}
                  onDelete={() => setSelectedRegion("")}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip
                label="Clear all"
                onClick={clearFilters}
                size="small"
                color="secondary"
                sx={{ cursor: "pointer", fontWeight: 600 }}
              />
            </Box>
          )}
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
            Showing {filteredCountries.length} of {countries.length} countries
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={country.cca3}>
                <CountryCard country={country} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  py: 8,
                  display: "flex",
                  justifyContent: "center",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  No countries found matching your criteria
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Fade>
  );
};

export default CountriesList;
