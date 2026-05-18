import { Box, Button, Switch, TextField, Typography } from "@mui/material";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";

export const BotInformation = () => {
  const { control, register } = useFormContext();

  const { fields, append } = useFieldArray({
    control,
    name: "teamMembers",
  });

  const isDevelopedByTeam = useWatch({
    control,
    name: "isTeam",
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h5" color="textPrimary">
          Bot Information
        </Typography>
        <Typography variant="body2" color="textPrimary">
          Tell us about your bot.
        </Typography>

        <TextField
          variant="filled"
          label="Bot Name"
          helperText="Enter your bot's name"
          {...register("name", { required: true })}
          required
        />

        <TextField
          variant="filled"
          label="Bot Description"
          helperText="Describe your bot's strategy and features"
          multiline
          rows={4}
          {...register("description", { required: true })}
          required
        />

        {!isDevelopedByTeam && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>Bot is developed by a Team</Typography>

            <Controller
              name="isTeam"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value || false}
                  onChange={(e) => onChange(e.target.checked)}
                />
              )}
            />
          </Box>
        )}
      </Box>

      {isDevelopedByTeam && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography>Bot is developed by a Team</Typography>

            <Controller
              name="isTeam"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </Box>

          <Typography variant="h6" color="textPrimary">
            Team Members
          </Typography>

          {fields.map((field, index) => (
            <TextField
              key={field.id}
              size="small"
              variant="filled"
              label="Team Member Name"
              {...register(`teamMembers.${index}.name`, { required: true })}
              required
            />
          ))}

          <Button
            variant="outlined"
            size="small"
            onClick={() => append({ name: "" })}
          >
            Add Team Member
          </Button>
        </Box>
      )}
    </Box>
  );
};
