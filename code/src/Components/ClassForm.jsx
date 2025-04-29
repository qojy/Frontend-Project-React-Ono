import React from "react";
import Layout from "./Layout";
import { Typography } from "@mui/material";

export default function ClassForm() {
  return (
    <Layout>
      <div>
        <Typography variant="h6" component="div" sx={{ color: "primary.main" }}>
          Add New Class
        </Typography>
      </div>
    </Layout>
  );
}
