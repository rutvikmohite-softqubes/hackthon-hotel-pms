import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

const FormSection = ({ title, children, sx = {} }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: alpha(theme.palette.text.secondary, 0.22),
        boxShadow:
          theme.palette.mode === "light"
            ? "0 2px 10px rgba(15, 23, 42, 0.07)"
            : "0 8px 20px rgba(0, 0, 0, 0.25)",
        backgroundColor:
          theme.palette.mode === "light"
            ? alpha("#ffffff", 0.95)
            : alpha("#0b121b", 0.9),
        ...sx,
      }}
    >
    <CardContent
      sx={{
        p: { xs: 2, sm: 2.5 },
        "&:last-child": { pb: { xs: 2, sm: 2.5 } },
      }}
    >
        <Typography
          variant="h6"
          sx={{
            mb: 2.25,
            pb: 1,
            fontWeight: 700,
            fontSize: "1.05rem",
            color: theme.palette.mode === "light" ? "#15803d" : "#8bf6c2",
            borderBottom:
              theme.palette.mode === "light"
                ? "1px solid rgba(34, 197, 94, 0.26)"
                : "1px solid rgba(70, 217, 143, 0.32)",
          }}
        >
          {title}
        </Typography>
      {children}
    </CardContent>
  </Card>
  );
};

export default FormSection;
