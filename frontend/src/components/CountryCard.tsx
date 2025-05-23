import LocationCityIcon from "@mui/icons-material/LocationCity";
import Payments from "@mui/icons-material/Payments";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Country } from "../types/country";
import FavoriteButton from "./FavoriteButton";

interface CountryCardProps {
  country: Country;
}

export const CountryCard = ({ country }: CountryCardProps) => {
  const navigate = useNavigate();
  const urlName = encodeURIComponent(country.name.common.toLowerCase());

  const getCurrencies = () => {
    if (!country.currencies) return "N/A";
    return Object.values(country.currencies)
      .map((currency) => `${currency.name} (${currency.symbol})`)
      .join(", ");
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: "100%",
        borderRadius: 3,
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.16), 0 8px 24px rgba(0,0,0,0.12)",
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/countries/${urlName}`)}
        sx={{ flexGrow: 1 }}
      >
        <CardMedia
          component="img"
          height="180"
          image={country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
        <CardContent sx={{ px: 3, pt: 2 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            noWrap
            sx={{ fontWeight: "600" }}
            title={country.name.common}
          >
            {country.name.common}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 1,
              color: "text.secondary",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PublicIcon fontSize="small" />
              <Tooltip title={country.subregion || ""}>
                <Typography variant="body2" noWrap>
                  {country.region}
                  {country.subregion && ` (${country.subregion})`}
                </Typography>
              </Tooltip>
            </Box>

            {country.capital && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <LocationCityIcon fontSize="small" />
                <Typography variant="body2" noWrap>
                  {country.capital[0]}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PeopleIcon fontSize="small" />
              <Typography variant="body2" noWrap>
                {country.population.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Payments fontSize="small" />
              <Tooltip title={getCurrencies()}>
                <Typography variant="body2" noWrap>
                  {getCurrencies()}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>

      <Divider sx={{ mx: 2 }} />

      <CardActions
        sx={{
          justifyContent: "flex-end",
          px: 2,
          py: 1,
          backgroundColor: "background.paper",
        }}
      >
        <FavoriteButton country={country} />
      </CardActions>
    </Card>
  );
};

export default CountryCard;
