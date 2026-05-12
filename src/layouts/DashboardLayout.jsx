import { useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";

import HeaderBar from "./HeaderBar";
import SidebarNav, { drawerWidth } from "./SidebarNav";

const DashboardLayout = ({ mode, onToggleMode, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <HeaderBar
        mode={mode}
        onToggleMode={onToggleMode}
        onOpenMobileNav={() => setMobileOpen(true)}
      />
      <SidebarNav mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, sm: 3 },
          background:
            theme.palette.mode === "light"
              ? "radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.9) 0%, rgba(243, 244, 246, 0.95) 46%), #f3f4f6"
              : "radial-gradient(circle at 18% 0%, rgba(25, 40, 60, 0.5) 0%, rgba(7, 12, 18, 0) 42%), #070c12",
          minHeight: "100vh",
        })}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
