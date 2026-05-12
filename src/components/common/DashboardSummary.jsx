import ApartmentIcon from "@mui/icons-material/Apartment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const DashboardSummary = ({ totalProperties, totalPortfolios }) => {
  const stats = [
    {
      id: "properties",
      label: "Total Properties",
      value: totalProperties,
      icon: <ApartmentIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #00796b, #26a69a)",
    },
    {
      id: "portfolios",
      label: "Total Portfolios",
      value: totalPortfolios,
      icon: <BusinessCenterIcon fontSize="large" />,
      gradient: "linear-gradient(135deg, #ef6c00, #ffb74d)",
    },
  ];

  return (
    <Grid container spacing={2}>
      {stats.map((item) => (
        <Grid key={item.id} item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ p: 0.4, background: item.gradient }} />
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {item.value}
                </Typography>
              </Box>
              <Box sx={{ color: "text.secondary" }}>{item.icon}</Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardSummary;
