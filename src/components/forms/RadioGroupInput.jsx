import { Controller } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

const RadioGroupInput = ({ name, control, label, options, row = true }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormControl error={Boolean(fieldState.error)}>
        <FormLabel sx={{ mb: 0.4, color: "text.primary", fontWeight: 500 }}>{label}</FormLabel>
        <RadioGroup row={row} {...field}>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={<Radio size="small" />}
              label={option.label}
              sx={{ mr: 1.5 }}
            />
          ))}
        </RadioGroup>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    )}
  />
);

export default RadioGroupInput;
