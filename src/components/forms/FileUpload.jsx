import { Controller } from "react-hook-form";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Box from "@mui/material/Box";
import FormHelperText from "@mui/material/FormHelperText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const FileUpload = ({ name, control, label, hideLabel = false, accept = "image/jpeg,image/jpg,image/png" }) => (
  <Controller
    name={name}
    control={control}
    render={({ field: { onChange, value }, fieldState }) => (
      <Stack spacing={1.5}>
        {!hideLabel && <Typography variant="subtitle2">{label}</Typography>}
        <Box
          component="label"
          sx={{
            width: "100%",
            maxWidth: 230,
            minHeight: 165,
            border: "1px solid",
            borderColor: "#c8d3ea",
            borderRadius: 1.5,
            display: "grid",
            placeItems: "center",
            backgroundColor: "#f7f9fe",
            cursor: "pointer",
          }}
        >
          {value ? (
            <Box
              component="img"
              src={URL.createObjectURL(value)}
              alt="Property Preview"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 1.5,
              }}
            />
          ) : (
            <ImageOutlinedIcon sx={{ fontSize: 46, color: "#1f2a44" }} />
          )}
          <input
            hidden
            type="file"
            accept={accept}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              onChange(file);
            }}
          />
        </Box>
        <FormHelperText error>{fieldState.error?.message}</FormHelperText>
      </Stack>
    )}
  />
);

export default FileUpload;
