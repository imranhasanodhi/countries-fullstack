import { Lock } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  Switch,
  Typography,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../theme/themeContext";

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const { toggleTheme, mode } = useThemeContext();
  const theme = useTheme();

  return (
    <AppBar
      position="static"
      sx={{
        mb: 4,
        backgroundColor: mode === "dark" ? "#121826" : "#f5f7fa",
        color: mode === "dark" ? "#e0e0e0" : "#333",
        boxShadow:
          mode === "dark"
            ? "0 4px 8px rgba(0,0,0,0.7)"
            : "0 4px 12px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side nav buttons */}
        <Box>
          {["/", "/test", "/countries", "/protected"].map((path, i) => {
            const label = ["Home", "Test", "Countries", "Protected Data"][i];
            const icon = path === "/protected" ? <Lock fontSize="small" sx={{ mr: 0.5 }} /> : null;
            return (
              <Button
                key={path}
                component={RouterLink}
                to={path}
                color="inherit"
                startIcon={icon}
                sx={{
                  fontWeight: 600,
                  mx: 1.25,
                  textTransform: "none",
                  fontSize: "1rem",
                  borderRadius: 1,
                  px: 2,
                  "&:hover": {
                    backgroundColor: mode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)",
                  },
                  transition: "background-color 0.25s ease",
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>

        {/* Right side: Theme toggle + user auth */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Theme toggle switch with icons */}
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleTheme}
                color="primary"
                inputProps={{ "aria-label": "toggle dark mode" }}
              />
            }
            label={
              <Typography variant="body2" sx={{ userSelect: "none" }}>
                {mode === "dark" ? "Dark Mode" : "Light Mode"}
              </Typography>
            }
            sx={{
              "& .MuiFormControlLabel-label": {
                color: mode === "dark" ? "#e0e0e0" : "#333",
                fontWeight: 600,
              },
              mr: 2,
            }}
          />

          {user ? (
            <Button
              onClick={signOut}
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 0.7,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Logout ({user.email})
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                px: 2.5,
                py: 0.7,
                boxShadow: theme.shadows[3],
                "&:hover": {
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
