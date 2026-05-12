import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { drawerWidth } from "./SidebarNav";

const HeaderBar = ({ mode, onToggleMode, onOpenMobileNav }) => (
  <AppBar
    position="fixed"
    color="transparent"
    elevation={0}
    sx={{
      width: { sm: `calc(100% - ${drawerWidth}px)` },
      ml: { sm: `${drawerWidth}px` },
      backdropFilter: "blur(10px)",
      backgroundColor: mode === "light" ? "rgba(255, 255, 255, 0.82)" : "rgba(5, 10, 16, 0.72)",
      borderBottom: "1px solid",
      borderColor: mode === "light" ? "rgba(17, 24, 39, 0.1)" : "rgba(138, 160, 186, 0.2)",
    }}
  >
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={onOpenMobileNav}
        sx={{ mr: 1, display: { sm: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Typography
        variant="h6"
        sx={{ flexGrow: 1, fontWeight: 700, color: mode === "light" ? "#111827" : "#dbe7f8" }}
      >
        Hotel Property Management Administration
      </Typography>
      <Box>
        <IconButton onClick={onToggleMode} color="inherit">
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Box>
    </Toolbar>
  </AppBar>
);

export default HeaderBar;
