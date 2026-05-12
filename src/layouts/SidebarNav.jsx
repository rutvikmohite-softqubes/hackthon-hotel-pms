import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;

const navItems = [
  { label: "Smart Onboarding", icon: <AssignmentTurnedInIcon />, path: "/onboarding" },
];

const SidebarNav = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const drawerContent = (
    <>
      <Toolbar sx={{ px: 3 }}>
        <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
          <DashboardIcon sx={{ color: "#46d98f" }} />
          <Typography
            variant="h6"
            sx={(theme) => ({
              fontWeight: 800,
              letterSpacing: 0.4,
              color: theme.palette.mode === "light" ? "#111827" : "#dbe7f8",
            })}
          >
            PMS Admin
          </Typography>
        </Box>
      </Toolbar>
      <Divider sx={(theme) => ({ borderColor: theme.palette.mode === "light" ? "rgba(17, 24, 39, 0.1)" : "rgba(255, 255, 255, 0.14)" })} />
      <List sx={{ p: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            onClick={onClose}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: (theme) => (theme.palette.mode === "light" ? "#334155" : "#c9d6e8"),
              "&.Mui-selected": {
                color: "#ffffff",
                backgroundColor: "#22c55e",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#16a34a",
              },
            }}
          >
            <ListItemIcon
              sx={(theme) => ({
                color:
                  location.pathname === item.path
                    ? "#ffffff"
                    : theme.palette.mode === "light"
                      ? "#64748b"
                      : "#8ea1b8",
              })}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={(theme) => ({
          display: { xs: "block", sm: "none" },
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundImage:
              theme.palette.mode === "light"
                ? "none"
                : "linear-gradient(180deg, #060b12, #0a1420)",
            backgroundColor: theme.palette.mode === "light" ? "#f8fafc" : "#0b121b",
            borderRight:
              theme.palette.mode === "light"
                ? "1px solid rgba(17, 24, 39, 0.08)"
                : "1px solid rgba(138, 160, 186, 0.16)",
            color: theme.palette.mode === "light" ? "#334155" : "#c9d6e8",
          },
        })}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={(theme) => ({
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundImage:
              theme.palette.mode === "light"
                ? "none"
                : "linear-gradient(180deg, #060b12, #0a1420)",
            backgroundColor: theme.palette.mode === "light" ? "#f8fafc" : "#0b121b",
            borderRight:
              theme.palette.mode === "light"
                ? "1px solid rgba(17, 24, 39, 0.08)"
                : "1px solid rgba(138, 160, 186, 0.16)",
            color: theme.palette.mode === "light" ? "#334155" : "#c9d6e8",
          },
        })}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default SidebarNav;
export { drawerWidth };
