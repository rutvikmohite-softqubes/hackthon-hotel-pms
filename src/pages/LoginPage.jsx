import { useState } from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link as RouterLink } from "react-router-dom";

const LoginPage = ({ mode, onToggleMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Demo screen only — no authentication or API calls.
  };

  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        background:
          theme.palette.mode === "light"
            ? "radial-gradient(circle at 25% 0%, #ffffff 0%, #f3f4f6 48%, #eef2f7 100%)"
            : "radial-gradient(circle at 20% 0%, #0f1b2d 0%, #070c12 45%, #05090f 100%)",
      })}
    >
      <IconButton
        onClick={onToggleMode}
        aria-label="Toggle light or dark mode"
        sx={(theme) => ({
          position: "absolute",
          top: 16,
          right: 16,
          color: theme.palette.mode === "light" ? "#334155" : "#c9d6e8",
          border: "1px solid",
          borderColor: theme.palette.mode === "light" ? "rgba(17, 24, 39, 0.12)" : "rgba(138, 160, 186, 0.25)",
          borderRadius: 2,
        })}
      >
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={(theme) => ({
          width: "100%",
          maxWidth: 420,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor:
            theme.palette.mode === "light"
              ? "rgba(17, 24, 39, 0.1)"
              : "rgba(138, 160, 186, 0.2)",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 2px 10px rgba(15, 23, 42, 0.08)"
              : "0 10px 28px rgba(0, 0, 0, 0.32)",
          backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#0b121b",
        })}
      >
        <Box
          sx={(theme) => ({
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(90deg, #e5e7eb 0%, #f3f4f6 100%)"
                : "linear-gradient(90deg, #0f1824 0%, #132334 100%)",
            borderBottom: "1px solid",
            borderColor: theme.palette.mode === "light" ? "rgba(17, 24, 39, 0.08)" : "rgba(138, 160, 186, 0.16)",
          })}
        >
          <DashboardIcon sx={{ color: "primary.main", fontSize: 32 }} />
          <Box>
            <Typography
              variant="h6"
              sx={(theme) => ({
                fontWeight: 800,
                letterSpacing: 0.3,
                color: theme.palette.mode === "light" ? "#111827" : "#fff",
              })}
            >
              PMS Admin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2.25} sx={{ p: { xs: 2.5, sm: 3 } }}>
          <TextField
            label="Email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            placeholder="Enter password"
          />

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 0.5, py: 1.1 }}>
            Sign in
          </Button>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 0.5 }}>
            
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
