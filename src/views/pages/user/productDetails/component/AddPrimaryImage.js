import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography
} from "@mui/material";
import clsx from "clsx";
import React from "react";
import { Icon } from "@iconify/react";
import { useCallback } from "react";
import { useState } from "react";
import closeFill from "@iconify-icons/eva/close-fill";
import { useDropzone } from "react-dropzone";
import ImageUpload from "assets/images/icons/upload-image.svg";
import AnimateButton from "ui-component/extended/AnimateButton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectAuthToken } from "store/Selector";
import axios from "utils/axios";
import { ethers } from "ethers";
import NFTAbi from "../../../../../contractAbi/NFT.json";
import { addPrimaryImageNft } from "redux/nftManagement/actions";

const AddPrimaryImage = ({ toggleImage, setToggleImage, id, contractAddress }) => {
  const dispatch = useDispatch();
  const [uploadedImages, setUploadedImages] = useState(null);
  const [loader, setLoader] = useState(false);
  const authToken = useSelector(makeSelectAuthToken());

  const handleDrop = useCallback(
    (acceptedFiles) => {
      let newUploadedImages = "";
      acceptedFiles.map(async (acceptedFile) => {
        let data = { image: acceptedFile };
        newUploadedImages = data;
      });
      setUploadedImages(newUploadedImages);
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadedImages]
  );
  const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: ".jpeg,.png,.jpg,.gif",
    onDrop: handleDrop,
    multiple: false
  });

  const AddImageHandler = async () => {
    if (!uploadedImages) {
      toast.error("Please Add Image");
    } else {
      try {
        setLoader(true);
        const formData = new FormData();
        formData.append("id", id);
        formData.append("image", uploadedImages.image);

        const headers = {
          Authorization: `Bearer ${authToken}`
        };

        const response = await axios.post(`/primaryImage`, formData, { headers });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const nft = new ethers.Contract(contractAddress, NFTAbi.abi, signer);

        const tokenId = response.data.data.tokenId;
        const ipfsUrl = response.data.data.ipfsUrl;
        // eslint-disable-next-line no-use-before-define
        const owner = await nft.ownerOf(tokenId, owner);

        await nft.updateUri(tokenId, ipfsUrl, owner);

        const data = {
          id,
          ipfsUrl,
          tokenUri: response.data.data.tokenUri,
          assetURL: response.data.data.assetURL
        };

        dispatch(addPrimaryImageNft({ data, setToggleImage }));
        setUploadedImages(null);
      } catch (error) {
        if (error.reason) {
          toast.error(error.reason || "An error occurred");
          setUploadedImages(null);
        } else {
          toast.error("An unexpected error occurred");
          setUploadedImages(null);
        }
      } finally {
        setLoader(false);
        setToggleImage(false);
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedImages(null);
  };
  return (
    <Dialog
      open={toggleImage}
      fullWidth="lg"
      aria-labelledby="form-dialog-title"
      aria-describedby="alert-dialog-slide-description1"
    >
      <DialogTitle>Add Image</DialogTitle>
      <DialogContent>
        {uploadedImages ? (
          <Grid container>
            <Grid item xs={12} lg={12} mt={2} key={uploadedImages.image.name} sx={{ position: "relative" }}>
              <img
                src={URL.createObjectURL(uploadedImages.image)}
                alt={uploadedImages.image.name}
                width="100%"
                height="200px"
                style={{ borderRadius: "5px", objectFit: "cover", height: "auto" }}
              />
              <IconButton
                color="error"
                edge="end"
                size="small"
                onClick={() => handleRemoveFile()}
                sx={{ ml: "3px", position: "absolute", right: "2%", top: "2%" }}
              >
                <Icon icon={closeFill} width={25} height={25} />
              </IconButton>
            </Grid>
          </Grid>
        ) : (
          <Grid
            sx={{ border: "2px dashed  #646769", borderRadius: "5px", paddingBottom: "1rem", paddingTop: "1rem" }}
            item
            lg={12}
            mt={2}
          >
            <div className={clsx("dropZoneContainer", "xyz")}>
              <div
                className={clsx("dropZone", {
                  isDragActive: isDragActive,
                  isDragAccept: isDragAccept,
                  isDragReject: isDragReject
                })}
                {...getRootProps()}
              >
                <input {...getInputProps()} />

                <Grid container direction="column">
                  <Box textAlign="center" component="img" alt="Select File" src={ImageUpload} sx={{ height: 48 }} />
                  <Box mt={2} textAlign="center" sx={{ ml: { md: 0 } }}>
                    <Typography variant="subtitle" sx={{ color: "grey", textAlign: "center", fontSize: "14px" }}>
                      <b style={{ color: "white" }}>Upload Image</b> or drag and drop &nbsp;
                      {/* <Link underline="always">browse</Link>.&nbsp; */}
                      <Box sx={{ fontSize: "12px" }} mt={0.5}>
                        PNG, JPG or GIF (max. 800 x 400px)
                      </Box>
                    </Typography>
                  </Box>
                </Grid>
              </div>
            </div>
          </Grid>
        )}
      </DialogContent>
      {loader ? (
        <DialogActions sx={{ pr: 2.5, width: "90%" }}>
          <CircularProgress sx={{ color: "blue", ml: 3 }} />
        </DialogActions>
      ) : (
        <DialogActions>
          <Box sx={{ display: "flex" }}>
            <AnimateButton>
              <Button
                className="buttons"
                size="large"
                type="submit"
                variant="outlined"
                sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                onClick={() => setToggleImage(false)}
                color="primary"
                disableElevation
              >
                Cancel
              </Button>
            </AnimateButton>
            <AnimateButton>
              <Button
                type="submit"
                variant="contained"
                sx={{ my: 1, ml: 1, padding: { md: "6px 50px", lg: "6px 50px" } }}
                onClick={() => {
                  AddImageHandler();
                }}
                className="buttons"
                size="large"
                disableElevation
              >
                Add
              </Button>
            </AnimateButton>
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default AddPrimaryImage;
