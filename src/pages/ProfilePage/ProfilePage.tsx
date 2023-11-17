import { Container, Paper } from "@mui/material";
import ChangePassword from "../../components/ChangePassword/ChangePassword";

export default function ProfilePage() {
  return (
    <Container maxWidth="sm">
      <Paper
        elevation={5}
        sx={{
          mt: 2,
          mb: 3,
          pl: 2,
          paddingRight: 2,
          paddingBottom: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ChangePassword />
      </Paper>
    </Container>
  );
}
