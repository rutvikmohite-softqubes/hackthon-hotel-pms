import { Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const SelectInput = ({ name, control, label, options, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <Stack spacing={0.7}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
          {label}
        </Typography>
        <FormControl fullWidth error={Boolean(fieldState.error)}>
          <Select
            {...field}
            value={field.value ?? ""}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="text.secondary">Select {label}</Typography>;
              }

              const found = options.find((option) =>
                typeof option === "string" ? option === selected : option.value === selected
              );

              if (!found) {
                return selected;
              }

              return typeof found === "string" ? found : found.label;
            }}
            {...props}
          >
            <MenuItem value="">
              <em>Select {label}</em>
            </MenuItem>
            {options.map((option) => {
              if (typeof option === "string") {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              }

              return (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      </Stack>
    )}
  />
);

export default SelectInput;
