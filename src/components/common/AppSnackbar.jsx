import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const AppSnackbar = ({ open, onClose, message, severity = "success" }) => (
  <Snackbar open={open} autoHideDuration={3000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
    <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
      {message}
    </Alert>
  </Snackbar>
);

export default AppSnackbar;
