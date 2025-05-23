import {
  ArrowBack,
  LocationCity,
  Payment,
  People,
  Public,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Typography,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { weatherApi } from "../api/services/weather";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchAllCountries,
  selectAllCountries,
  selectCountriesError,
  selectCountriesLoading,
} from "../store/slices/countriesSlice";
import { WeatherData } from "../types/weather";
import WeatherInfo from "./WeatherInfo";

const CountryDetail = () => {
  const { name } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const countries = useAppSelector(selectAllCountries);
  const loading = useAppSelector(selectCountriesLoading);
  const error = useAppSelector(selectCountriesError);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const country = countries.find(
    (country) =>
      country.name.common.toLowerCase() === decodeURIComponent(name || "")
  );

  useEffect(() => {
    if (!country) {
      dispatch(fetchAllCountries());
    }
  }, [country, dispatch]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!country?.capital?.[0]) return;
      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const data = await weatherApi.getWeatherByCity(country.capital[0]);
        setWeatherData(data as unknown as WeatherData);
      } catch (error) {
        console.error(error);
        setWeatherError("Failed to fetch weather data");
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [country]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  if (!country) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Country not found.
        </Typography>
      </Box>
    );
  }

  const getCurrencies = () => {
    if (!country.currencies) return "None";
    return Object.entries(country.currencies)
      .map(
        ([code, currency]) => `${currency.name} (${currency.symbol}) [${code}]`
      )
      .join(", ");
  };

  return (
    <Box p={{ xs: 2, md: 4 }} maxWidth={800} mx="auto">
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/countries")}
        sx={{ mb: 3 }}
        variant="outlined"
        color="primary"
      >
        Back to Countries
      </Button>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.1), 0 1px 6px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          height="300"
          image={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          sx={{ objectFit: "cover" }}
        />

        <CardContent sx={{ px: 4, py: 3 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            gutterBottom
            noWrap
            title={country.name.common}
          >
            {country.name.common}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontStyle: "italic" }}
          >
            {country.name.official}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Region & Subregion */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
              color: "text.secondary",
            }}
          >
            <Public fontSize="medium" />
            <Tooltip title={country.subregion || ""}>
              <Typography variant="body1" noWrap>
                <strong>Region:</strong> {country.region}
                {country.subregion && ` (${country.subregion})`}
              </Typography>
            </Tooltip>
          </Box>

          {/* Capital */}
          {country.capital && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
                color: "text.secondary",
              }}
            >
              <LocationCity fontSize="medium" />
              <Typography variant="body1" noWrap>
                <strong>Capital:</strong> {country.capital.join(", ")}
              </Typography>
            </Box>
          )}

          {/* Population */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
              color: "text.secondary",
            }}
          >
            <People fontSize="medium" />
            <Typography variant="body1" noWrap>
              <strong>Population:</strong> {country.population.toLocaleString()}
            </Typography>
          </Box>

          {/* Currencies */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "text.secondary",
              wordBreak: "break-word",
            }}
          >
            <Payment fontSize="medium" />
            <Tooltip title={getCurrencies()}>
              <Typography variant="body1" noWrap>
                <strong>Currencies:</strong> {getCurrencies()}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {weatherLoading && (
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={36} />
        </Box>
      )}

      {weatherData && !weatherLoading && (
        <Box mt={4}>
          <WeatherInfo
            weatherData={weatherData}
            loading={weatherLoading}
            error={weatherError}
          />
        </Box>
      )}

      {weatherError && (
        <Typography color="error" mt={2}>
          {weatherError}
        </Typography>
      )}
    </Box>
  );
};

export default CountryDetail;
