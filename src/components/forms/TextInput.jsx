import { Controller } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const TextInput = ({ name, control, label, type = "text", ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Stack spacing={0.7}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
          {label}
        </Typography>
        <TextField
          {...field}
          value={field.value ?? ""}
          placeholder={`Enter ${label}...`}
          type={type}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message}
          {...props}
        />
      </Stack>
    )}
  />
);

export default TextInput;
