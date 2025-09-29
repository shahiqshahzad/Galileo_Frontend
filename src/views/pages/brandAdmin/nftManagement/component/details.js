import { forwardRef } from "react";

// material-ui
import {
  DialogActions,
  Button,
  Dialog,
  CardMedia,
  Divider,
  Grid,
  ListItemText,
  ListItemButton,
  List,
  Slide,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// assets
import CloseIcon from "@mui/icons-material/Close";
import MainCard from "./mainCard";
import moment from "moment";

// slide animation
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ===============================|| UI DIALOG - FULL SCREEN ||=============================== //

export default function DetailsDialog({ open, setOpen, nftData }) {
  const theme = useTheme();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        {/*    <IconButton float="left" color="inherit" onClick={handleClose} aria-label="close" size="large">
                    <CloseIcon />
                </IconButton> */}
        <DialogActions sx={{ pr: 2.5, pt: 2.5 }}>
          <Button
            className="buttonSize"
            size="large"
            sx={{ color: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
          >
            <CloseIcon />
          </Button>
        </DialogActions>
        <Grid container sx={{ pr: 2.5, pl: 2.5, pt: 2.5 }}>
          <Grid item xs={12} md={8} lg={8} sx={{ pr: 2.5 }}>
            <List>
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-in-detail">
                      Name
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="font-in-detail" sx={{ textTransform: "capitalize" }}>
                      {nftData?.name}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-in-detail">
                      Check
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="font-in-detail">
                      {nftData?.check}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-in-detail">
                      Description
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="font-in-detail">
                      {nftData?.description}
                    </Typography>
                  }
                />
              </ListItemButton>
              {/* <Divider />
                    <ListItemButton>
                        <ListItemText
                            primary={<Typography variant="subtitle1" className='font-in-detail' >Price</Typography>}
                            secondary={<Typography variant="caption" className='font-in-detail'  sx={{textTransform:'capitalize'}}>{nftData?.price}</Typography>}
                        />
                    </ListItemButton> */}
              {/* <Divider />
                    <ListItemButton>
                        <ListItemText
                            primary={<Typography variant="subtitle1" className='font-in-detail' >Mint Type</Typography>}
                            secondary={<Typography variant="caption" className='font-in-detail'  sx={{textTransform:'capitalize'}}>{ nftData?.mintType}</Typography>}
                        />
                    </ListItemButton> */}
              <Divider />
              <ListItemButton>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="font-in-detail">
                      Brand Name
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" className="font-in-detail">
                      {nftData?.Brand?.name}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Divider />
              {/* {nftData.NFTTokens.map((item)=>(
                    <>
                    <ListItemButton>
                    <ListItemText
                        primary={<Typography variant="subtitle1" className='font-in-detail' >Serial Id</Typography>}
                        secondary={<Typography variant="caption" className='font-in-detail'  sx={{textTransform:'capitalize'}}>{item?.serialId? item?.serialId : 'No Serial Id' }</Typography>}
                    />
                    
                </ListItemButton>
                <Divider />
                </>
                  ))} */}
            </List>
            <MainCard
              className="tableShadow"
              sx={{ margin: "20px", overflow: "initial" }}
              title={
                <Grid container>
                  <Grid item md={8} xs={12}>
                    <Typography
                      variant="h1"
                      component="h3"
                      className="approveHeading"
                      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      NFT MetaData
                    </Typography>
                  </Grid>
                </Grid>
              }
              content={false}
            >
              <Grid container sx={{ pr: 0, pl: 0, pt: 2.5 }}>
                {/*   <caption className="approveHeading">NFT MetaData </caption> */}

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Display Type</TableCell>
                        <TableCell align="center">Trait Type</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">Country Code</TableCell>
                        <TableCell align="center">Primary Location</TableCell>
                        {/* <TableCell align="center">isEditable</TableCell>
                    <TableCell align="center">Proof Required</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nftData?.NFTMetaData?.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell align="center">{row?.display_type}</TableCell>
                          <TableCell align="center">
                            <Tooltip placement="right" title={row?.trait_type}>
                              <span>{row?.trait_type.slice(0, 20)}</span>
                            </Tooltip>
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip
                              placement="right"
                              title={
                                row?.display_type === "Date" ? moment(row?.value).format("DD MMM YYYY") : row?.value
                              }
                            >
                              <span>
                                {row?.display_type === "Date"
                                  ? moment(row?.value).format("DD MMM YYYY")
                                  : row?.value?.slice(0, 20)}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="center">{row?.countryCode ? row?.countryCode : "-"}</TableCell>
                          <TableCell align="center">{row?.primaryLocation === true ? "true" : "false"}</TableCell>
                          {/* <TableCell align="center">{row?.isEditable == true ? 'true' : 'false'}</TableCell>
                      <TableCell align="center">{row?.proofRequired == true ? 'true' : 'false'}</TableCell> */}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </MainCard>
            <MainCard
              className="tableShadow"
              sx={{ margin: "20px", overflow: "initial" }}
              title={
                <Grid container>
                  <Grid item md={8} xs={12}>
                    <Typography
                      variant="h1"
                      component="h3"
                      className="approveHeading"
                      sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#000" }}
                    >
                      Authenticity Files
                    </Typography>
                  </Grid>
                </Grid>
              }
              content={false}
            >
              <Grid container sx={{ pr: 0, pl: 0, pt: 2.5 }}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="caption table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Field Name </TableCell>

                        <TableCell align="center">Field Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {nftData?.NFTMetaFiles?.map((row, index) => (
                        <TableRow key={index}>
                          <Tooltip placement="right" title={row?.fieldName}>
                            <TableCell align="center" sx={{ fontSize: "15px", textTransform: "capitalize" }}>
                              {row?.fieldName.slice(0, 20)}
                            </TableCell>
                          </Tooltip>
                          <TableCell
                            align="center"
                            sx={{ fontSize: "15px", color: "#2194FF", cursor: "pointer" }}
                            onClick={() => {
                              window.open(row?.fieldValue, "_blank");
                            }}
                          >
                            {row?.fieldValue}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <CardMedia
              component="img"
              image={nftData?.asset}
              sx={{ minheight: "auto", maxHeight: "570px", overflow: "hidden", cursor: "Pointer" }}
            />
          </Grid>
        </Grid>
      </Dialog>
    </div>
  );
}
