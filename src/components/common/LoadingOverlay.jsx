import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingOverlay = ({ open }) => (
  <Backdrop
    open={open}
    sx={{
      zIndex: (theme) => theme.zIndex.drawer + 3,
      color: "#fff",
    }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default LoadingOverlay;
