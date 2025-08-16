// components/dashboard/AvailableRoomsList.jsx
import { Card, CardContent, Typography, Box, Divider } from "@mui/material";
import { Room as RoomIcon } from "@mui/icons-material";
import { useEffect } from "react";

const AvailableRoomsList = ({ rooms }) => {
  return (
    <Card
      elevation={4}
      sx={{ borderRadius: 3, height: "50%", overflow: "auto" }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <RoomIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Dostupne sobe
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {rooms.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ py: 2 }}
          >
            Nema dostupnih soba
          </Typography>
        ) : (
          <Box sx={{ width: "100%" }}>
            {rooms.slice(0, 4).map((room, index) => (
              <Box
                key={room.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom:
                    index < Math.min(rooms.length, 4) - 1
                      ? "1px solid #f0f0f0"
                      : "none",
                  gap: 1.5,
                }}
              >
                <RoomIcon fontSize="small" color="success" />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight="500" noWrap>
                    {room.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {room.location}
                  </Typography>
                </Box>
              </Box>
            ))}
            {rooms.length > 4 && (
              <Box sx={{ py: 1, textAlign: "center", mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  + još {rooms.length - 4} soba
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailableRoomsList;
