import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import moment from "moment";
import { Icons } from "shared/Icons/Icons";

import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { cloneDeep } from "lodash";

import { Box, Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddFormDialog from "./addAddress";
import { useDispatch, useSelector } from "react-redux";
import DeletedDialog from "./deleteAddress";
import { getAllPermissions, makePublic } from "redux/permissioned/actions";
import Stack from "@mui/material/Stack";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { styled } from "@mui/material/styles";

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#2194FF",
        "& + .MuiSwitch-track": {
          backgroundColor: "transparent",
          border: "1.4px solid #2194FF",
          opacity: 1
          // border: 0
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5
        }
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#2194FF",
        border: "6px solid #fff"
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600]
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3
      }
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      border: "1.4px solid #FFFFFF",
      // border: '1.4px solid #2194FF',
      backgroundColor: "transparent",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500
      })
    }
  })
);

export default function PermissionedDialog({ open, setOpen, NftId, nftList }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPermissions({ id: NftId !== undefined ? NftId : "1" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [NftId]);

  const permissionedList = useSelector((state) => state.permissioned?.permissionList);

  const handleClose = () => {
    setNewAddressAdded(false);
    setOpen(false);
  };
  const [newAddressAdded, setNewAddressAdded] = useState(false);
  const [checked, setChecked] = useState(false);
  const [alreadyChecked, setAlreadyChecked] = useState(true);

  const [deleteAddress, setDeleteAddress] = useState(false);
  const [addAddress, setaddAddress] = useState(false);
  const [updatedAddress, setUpdatedAddress] = useState({
    id: 0,
    NftId: 0,
    walletAddress: "",
    expTime: ""
  });
  const [id, setId] = useState(0);

  const walletadded = (event, index) => {
    const isChecked = event.target.checked;
    const alreadyChecked = event.target.checked;
    setChecked(isChecked);
    setAlreadyChecked(alreadyChecked);
    dispatch(
      makePublic({
        id: NftId,
        isPublic: isChecked.toString()
      })
    );
  };
  const addAddressed = (event, index) => {
    setaddAddress(true);
  };
  return (
    <div>
      <DeletedDialog
        updatedAddress={updatedAddress}
        setUpdatedAddress={setUpdatedAddress}
        open={deleteAddress}
        setOpen={setDeleteAddress}
      />
      <AddFormDialog
        NftId={NftId}
        id={id}
        updatedAddress={cloneDeep(updatedAddress)}
        setUpdatedAddress={setUpdatedAddress}
        open={addAddress}
        setOpen={setaddAddress}
        setNewAddressAdded={setNewAddressAdded}
      />
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={"md"}
        PaperProps={{
          style: {
            borderRadius: "1px", // Setting border radius
            width: "1042px", // Setting width
            maxHeight: "610px"
          }
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {" "}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs zeroMinWidth sx={{ textDecoration: "none", alignSelf: "center" }}>
              <Typography
                sx={{ cursor: "pointer", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                align="left"
                variant="h2"
                className="serial-No"
              >
                Serial No
              </Typography>
            </Grid>
            <Grid item sx={{ display: "flex", height: "60px" }}>
              <Typography
                sx={{ cursor: "pointer", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                align="left"
                variant="h3"
                className="make-Public"
              >
                Make public
              </Typography>

              <FormGroup>
                <FormControlLabel
                  control={
                    <IOSSwitch
                      sx={{ m: 1 }}
                      checked={nftList?.nft?.isMetadataPublic === true ? alreadyChecked : checked}
                      onChange={walletadded}
                    />
                  }
                  label=""
                />
              </FormGroup>
              <Box onClick={handleClose} sx={{ cursor: "pointer" }}>
                {Icons?.closeicon}
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TableContainer sx={{ marginTop: "20px" }}>
              <Table>
                <TableHead sx={{ background: theme.palette.mode === "dark" ? "#252B2F" : "#fff" }}>
                  <TableRow>
                    <TableCell className="permissionedTable" align="left">
                      Shared with
                    </TableCell>

                    <TableCell
                      className="permissionedTable"
                      sx={{ color: theme.palette.mode === "light" ? "black" : "#fff" }}
                      align="left"
                    >
                      Expire date
                    </TableCell>
                    <TableCell className="permissionedTable" sx={{}} align="left"></TableCell>
                  </TableRow>
                </TableHead>
                {NftId !== undefined &&
                  permissionedList?.map((item) => (
                    <TableBody>
                      <TableRow>
                        <TableCell
                          className="TableBody-data"
                          sx={{ fontSize: "15px", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                          align="left"
                        >
                          {item?.walletAddress}
                        </TableCell>
                        <TableCell
                          className="TableBody-data"
                          sx={{ fontSize: "15px", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                          align="left"
                        >
                          {moment(`${item?.expTime}`).format("Do MMM YYYY h:mm a")}
                        </TableCell>

                        <TableCell
                          className="TableBody-data"
                          sx={{ fontSize: "15px", color: theme.palette.mode === "light" ? "black" : "#fff" }}
                          align="right"
                        >
                          <Button
                            variant="outlined"
                            className="edit-permission"
                            onClick={() => {
                              addAddressed();
                              setUpdatedAddress({
                                id: item?.id,
                                NftId: NftId !== undefined && NftId,
                                walletAddress: item?.walletAddress,
                                expTime: item?.expTime
                              });
                              setId(item?.id);
                            }}
                            startIcon={Icons?.EditIcon}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            className="delete-permission"
                            onClick={() => {
                              setDeleteAddress(true);
                              setUpdatedAddress({
                                id: item?.id,
                                NftId: NftId !== undefined && NftId,
                                walletAddress: item?.walletAddress,
                                expTime: item?.expTime
                              });
                            }}
                            startIcon={Icons.DeleteIcon}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ))}
              </Table>
            </TableContainer>
          </DialogContentText>
          <DialogActions sx={{ marginTop: "20px", p: 0 }}>
            {newAddressAdded && (
              <Stack direction="row" spacing={1}>
                {Icons.checkmarkBadge}
                <Typography
                  sx={{ color: theme.palette.mode === "light" ? "black" : "#fff", marginRight: "1rem" }}
                  align="left"
                  variant="subtitle1"
                >
                  Your new address has been added
                </Typography>
              </Stack>
            )}
            <Button
              variant="contained"
              className="add-address"
              onClick={() => {
                addAddressed();
              }}
            >
              Add New address
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
