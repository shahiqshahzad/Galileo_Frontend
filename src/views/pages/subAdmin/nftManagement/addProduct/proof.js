import React, { useState } from "react";
import { Stack } from "@mui/system";
import "react-circular-progressbar/dist/styles.css";
import { Button, Tooltip, Typography } from "@mui/material";
import { Icons } from "shared/Icons/Icons";
import { AddProofDlg } from "./addProofDlg";

export const Proof = ({
  fileDataArray,
  setFileDataArray,
  authFileNameBol,
  setAuthFileNameBol,
  setErrorsArray,
  errorsArray,
  nftId
}) => {
  const [openDlg, setOpenDlg] = useState(false);

  const handleFileRemoveField = (index) => {
    let array = [...fileDataArray];
    array.splice(index, 1);
    setFileDataArray(array);
  };

  return (
    <Stack sx={{ position: "relative" }}>
      <Typography sx={{ color: "white", fontWeight: 700, fontSize: "20px" }} className="HeaderFonts">
        Proof of Authenticity
      </Typography>
      <Button
        className="fieldbutton"
        variant="contained"
        sx={{
          right: "0",
          position: "absolute",
          padding: "4px 20px",
          background: "linear-gradient(97.63deg, #2F57FF 0%, #2FA3FF 108.45%)"
        }}
        onClick={() => setOpenDlg(true)}
      >
        Add Authenticity Files
      </Button>

      {fileDataArray.length !== 0 && (
        <Stack mt={1}>
          {fileDataArray.map((data, index) => (
            <Stack mt={2} sx={{ flexDirection: "row", gap: "1rem", alignItems: "center" }}>
              <Typography sx={{ background: "#252B2F", padding: "12px", borderRadius: "5px", width: "15rem" }}>
                {data?.trait_type ? data?.trait_type : data?.fieldName}
              </Typography>

              <Tooltip className="fontsize" title="View proof" placement="top" arrow>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (data?.value) {
                      window.open(URL.createObjectURL(data.value), "_blank");
                    } else {
                      window.open(data.fieldValue, "_blank");
                    }
                  }}
                >
                  {Icons.viewProofDocument}
                </span>
              </Tooltip>

              <Button
                className="fieldbutton"
                variant="contained"
                sx={{
                  padding: "4px 20px",
                  background: "linear-gradient(97.63deg, #FF2F2F 0%, #FF4F4F 108.45%) !important"
                }}
                onClick={() => handleFileRemoveField(index)}
              >
                Delete
              </Button>
            </Stack>
          ))}
        </Stack>
      )}
      <AddProofDlg
        open={openDlg}
        nftId={nftId}
        errorsArray={errorsArray}
        fileDataArray={fileDataArray}
        setErrorsArray={setErrorsArray}
        setFileDataArray={setFileDataArray}
        handleClose={() => setOpenDlg(false)}
        setAuthFileNameBol={setAuthFileNameBol}
      />
    </Stack>
  );
};
