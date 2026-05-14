import { useMemo, useState } from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLocation } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const location = useLocation();
  const [mode, setMode] = useState("light");

  const isLoginRoute = location.pathname === "/login";



  const theme = useMemo(() => {

    const isLight = mode === "light";



    return createTheme({

        palette: {

          mode,

          primary: {

            main: "#46d98f",

            light: "#7ef0b6",

            dark: "#1aa768",

            contrastText: "#04120a",

          },

          secondary: {

            main: "#7c3aed",

            light: "#a78bfa",

            dark: "#5b21b6",

            contrastText: "#f8fafc",

          },

          info: {

            main: "#38bdf8",

          },

          success: {

            main: "#22c55e",

          },

          warning: {

            main: "#f59e0b",

          },

          error: {

            main: "#ef4444",

          },

          background: {

            default: isLight ? "#f3f4f6" : "#070c12",

            paper: isLight ? "#ffffff" : "#0b121b",

          },

          text: {

            primary: isLight ? "#111827" : "#dbe7f8",

            secondary: isLight ? "#6b7280" : "#8aa0ba",

          },

          divider: isLight ? "rgba(17, 24, 39, 0.1)" : "rgba(138, 160, 186, 0.2)",

        },

        shape: {

          borderRadius: 8,

        },

        typography: {

          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",

          body2: { fontSize: "0.9rem" },

          h4: { fontWeight: 800 },

          h6: { fontWeight: 700 },

        },

        components: {

          MuiCssBaseline: {

            styleOverrides: {

              body: {

                background: isLight

                  ? "radial-gradient(circle at 25% 0%, #ffffff 0%, #f3f4f6 48%, #eef2f7 100%)"

                  : "radial-gradient(circle at 20% 0%, #0f1b2d 0%, #070c12 45%, #05090f 100%)",

              },

              "*::-webkit-scrollbar": {

                width: 10,

                height: 10,

              },

              "*::-webkit-scrollbar-track": {

                background: isLight ? "#e5e7eb" : "#0a1119",

              },

              "*::-webkit-scrollbar-thumb": {

                background: isLight ? "#9ca3af" : "#1f3348",

                borderRadius: 8,

              },

              "*::-webkit-scrollbar-thumb:hover": {

                background: isLight ? "#6b7280" : "#2f4d6f",

              },

            },

          },

          MuiPaper: {

            styleOverrides: {

              root: {

                backgroundImage: "none",

                backgroundColor: isLight ? "#ffffff" : "#0b121b",

                border: `1px solid ${isLight ? "rgba(17, 24, 39, 0.08)" : "rgba(134, 157, 183, 0.16)"}`,

                boxShadow: isLight ? "0 2px 10px rgba(15, 23, 42, 0.08)" : "0 10px 28px rgba(0, 0, 0, 0.32)",

                transition: "box-shadow 0.25s ease, transform 0.2s ease",

              },

            },

          },

          MuiButton: {

            styleOverrides: {

              root: {

                textTransform: "none",

                fontWeight: 600,

                borderRadius: 7,

                minHeight: 38,

                letterSpacing: 0.3,

                transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",

                "&:active": {

                  transform: "scale(0.97)",

                },

              },

              containedPrimary: {

                background: "linear-gradient(135deg, #1db46b 0%, #34d399 100%)",

                boxShadow: "0 0 0 1px rgba(70, 217, 143, 0.2), 0 8px 24px rgba(34, 197, 94, 0.35)",

                "&:hover": {

                  background: "linear-gradient(135deg, #18a15f 0%, #2db887 100%)",

                  boxShadow: "0 0 0 1px rgba(70, 217, 143, 0.35), 0 10px 28px rgba(34, 197, 94, 0.42)",

                  transform: "translateY(-1px)",

                },

                "&:active": {

                  transform: "translateY(0) scale(0.97)",

                },

              },

              outlinedPrimary: {

                borderColor: "#2fb57a",

                color: isLight ? "#1f8f5a" : "#7ef0b6",

                transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",

                "&:hover": {

                  backgroundColor: "rgba(70, 217, 143, 0.1)",

                  borderColor: "#46d98f",

                  transform: "translateY(-1px)",

                  boxShadow: "0 4px 16px rgba(34, 197, 94, 0.22)",

                },

              },

            },

          },

          MuiTextField: {

            defaultProps: {

              size: "small",

              variant: "outlined",

            },

          },

          MuiFormControl: {

            defaultProps: {

              size: "small",

            },

          },

          MuiOutlinedInput: {

            styleOverrides: {

              root: {

                backgroundColor: isLight ? "#ffffff" : "#0a121c",

                borderRadius: 0,

                transition: "box-shadow 0.2s ease, border-color 0.2s ease",

                "&:hover .MuiOutlinedInput-notchedOutline": {

                  borderColor: "#2bb877",

                },

                "&:hover": {

                  boxShadow: isLight

                    ? "0 0 0 3px rgba(43, 184, 119, 0.1)"

                    : "0 0 0 3px rgba(43, 184, 119, 0.14)",

                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {

                  borderColor: "#46d98f",

                  borderWidth: 2,

                },

                "&.Mui-focused": {

                  boxShadow: "0 0 0 4px rgba(70, 217, 143, 0.2)",

                },

              },

              notchedOutline: {

                borderColor: isLight ? "#d1d5db" : "#223244",

                borderRadius: 0,

                transition: "border-color 0.2s ease",

              },

              input: {

                paddingTop: 10,

                paddingBottom: 10,

              },

            },

          },

          MuiSelect: {

            styleOverrides: {

              root: {

                backgroundColor: isLight ? "#ffffff" : "#0a121c",

                borderRadius: 0,

              },

            },

          },

          MuiCard: {

            styleOverrides: {

              root: {

                backgroundColor: isLight ? "#ffffff" : "#0b121b",

                border: `1px solid ${isLight ? "rgba(17, 24, 39, 0.08)" : "rgba(134, 157, 183, 0.16)"}`,

                transition: "box-shadow 0.25s ease",

              },

            },

          },

          MuiListItemButton: {

            styleOverrides: {

              root: {

                transition: "background-color 0.18s ease, transform 0.15s ease",

                "&:hover": {

                  backgroundColor: "rgba(70, 217, 143, 0.12)",

                  transform: "translateX(4px)",

                },

                "&.Mui-selected": {

                  backgroundColor: "rgba(70, 217, 143, 0.2)",

                },

                "&.Mui-selected:hover": {

                  backgroundColor: "rgba(70, 217, 143, 0.28)",

                },

              },

            },

          },

          MuiTableRow: {

            styleOverrides: {

              root: {

                transition: "background-color 0.15s ease",

                "&:hover td": {

                  backgroundColor: isLight ? "#f8fafc" : "#101a27",

                },

              },

            },

          },

          MuiTableHead: {

            styleOverrides: {

              root: {

                backgroundColor: isLight ? "#f8fafc" : "#0f1722",

              },

            },

          },

          MuiTableCell: {

            styleOverrides: {

              head: {

                fontWeight: 700,

                color: isLight ? "#111827" : "#cdd9e8",

                borderBottom: `1px solid ${isLight ? "#e5e7eb" : "#243447"}`,

              },

              body: {

                color: isLight ? "#374151" : "#b3c4d9",

                borderBottom: `1px solid ${isLight ? "rgba(17, 24, 39, 0.06)" : "rgba(134, 157, 183, 0.12)"}`,

              },

            },

          },

          MuiChip: {

            styleOverrides: {

              root: {

                fontWeight: 600,

                transition: "transform 0.15s ease, box-shadow 0.15s ease",

                backgroundColor: isLight ? "rgba(70, 217, 143, 0.16)" : "rgba(70, 217, 143, 0.12)",

                color: isLight ? "#1f8f5a" : "#8bf6c2",

                "&:hover": {

                  transform: "scale(1.04)",

                },

              },

            },

          },

          MuiIconButton: {

            styleOverrides: {

              root: {

                transition: "background-color 0.18s ease, transform 0.18s ease",

                "&:hover": {

                  backgroundColor: isLight ? "rgba(70, 217, 143, 0.08)" : "rgba(70, 217, 143, 0.12)",

                  transform: "scale(1.12)",

                },

              },

            },

          },

          MuiTooltip: {

            styleOverrides: {

              tooltip: {

                borderRadius: 6,

                fontSize: "0.8rem",

              },

            },

          },

        },

    });

  }, [mode]);



  const toggleMode = () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));

  return (
    <ThemeProvider theme={theme}>
      {isLoginRoute ? (
        <AppRoutes mode={mode} onToggleMode={toggleMode} />
      ) : (
        <DashboardLayout mode={mode} onToggleMode={toggleMode}>
          <AppRoutes mode={mode} onToggleMode={toggleMode} />
        </DashboardLayout>
      )}
    </ThemeProvider>
  );

};



export default App;

