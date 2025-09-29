import { useTheme } from "@emotion/react";
// import ModeEditIcon from "@mui/icons-material/BorderColorSharp";
import { Button, Grid, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { Icons } from "shared/Icons/Icons";

export default function MintRequestActions({ nftList, setNftAction, type, filter }) {
  const theme = useTheme();

  const user = useSelector((state) => state.auth.user);

  return (
    <Grid direction={"row"} container>
      <Grid item xs={12} lg={12} md={12}>
        <Stack spacing={1} direction="row" width={"100%"} sx={{ justifyContent: "flex-end" }}>
          {nftList?.status === "REQUESTED" && nftList.editStatus === "not_requested" && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "6px 10px", maxWidth: "7.8em", fontFamily: theme?.typography.appText }}
              onClick={(e) => setNftAction({ type: "mint", role: user.role, status: nftList.status, e })}
            >
              List for sale
            </Button>
          )}
          {filter !== "sold" && (
            <>
              <Button
                variant="contained"
                color="primary"
                sx={{ minWidth: "50px" }}
                onClick={(e) => setNftAction({ type: "edit", role: user.role, status: nftList.status, e })}
              >
                {Icons.editNft}
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: "50px" }}
                onClick={(e) =>
                  setNftAction({
                    type: "reject",
                    // type: filter === "listed" ? "reject-listed" : "reject",
                    role: user.role,
                    status: nftList.status,
                    e
                  })
                }
              >
                {Icons.rejectNft}
              </Button>
            </>
          )}
          {nftList.status === "REJECTED" &&
            (user.role === "Sub Admin" || user.role === "Super Admin") &&
            type === "rejected" && (
              <Button
                variant="outlined"
                color="error"
                fullWidth
                sx={{ marginRight: "5px", fontWeight: "300", fontFamily: theme?.typography.appText }}
                onClick={(e) => setNftAction({ type: "update_reason", role: user.role, status: nftList.status, e })}
              >
                Update reject reason
              </Button>
            )}

          {nftList.editStatus === "temp" && (
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: "5px", fontFamily: theme?.typography.appText }}
              onClick={(e) => setNftAction({ type: "reject", role: user.role, status: nftList.editStatus, e })}
            >
              Reject
            </Button>
          )}
          {nftList.editStatus === "temp" && (
            // && nftData?.isEditable == true
            <Button
              variant="contained"
              color="primary"
              sx={{ marginRight: "5px", fontFamily: theme?.typography.appText }}
              onClick={(e) => setNftAction({ type: "approve", role: user.role, status: nftList.editStatus, e })}
            >
              Approve
            </Button>
          )}
          {!nftList?.bulkId &&
            nftList.editStatus !== "temp" &&
            nftList?.isSold === false &&
            nftList?.status === "MINTED" &&
            user.role === "Sub Admin" &&
            nftList?.progressState !== "updateUriPending" && (
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: "5px", fontFamily: theme?.typography.appText }}
                onClick={(e) => setNftAction({ type: "all", role: user.role, status: nftList.status, e })}
              >
                Remove Item
              </Button>
            )}
          {/* {!nftList?.bulkId && nftList?.status == "MINTED" && nftList?.progressState !== "updateUriPending" && (
            <Button
              variant="contained"
              color="primary"
              sx={{ width: "10px" }}
              onClick={(e) => setNftAction({ type: "edit_after_mint", role: user.role, status: nftList.status, e })}
            >
              {Icons.editNft}
            </Button>
          )} */}
        </Stack>
      </Grid>
    </Grid>
  );
}
