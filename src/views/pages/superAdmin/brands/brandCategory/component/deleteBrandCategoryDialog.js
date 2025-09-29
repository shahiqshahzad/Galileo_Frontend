import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  DialogContentText,
  Typography
} from "@mui/material";
import { deleteBrandCategory } from "../../../../../../redux/brandCategory/actions";
const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);
export default function DeleteBrandCategoryDialog({ open, setOpen, page, limit, search, brandCategoryData }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title1"
        aria-describedby="alert-dialog-slide-description1"
      >
        <DialogTitle id="alert-dialog-slide-title1" className="assignheading">
          Delete Brand Category
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description1">
            <Typography variant="body2" component="span" className="statustypo">
              Are you sure you want to delete this Category?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2.5 }}>
          <Button
            sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
            onClick={handleClose}
            color="secondary"
            className="buttonSize"
            size="large"
          >
            No
          </Button>
          <Button
            variant="contained"
            className="buttonSize"
            size="large"
            onClick={() => {
              dispatch(
                deleteBrandCategory({
                  categoryId: brandCategoryData.categoryId,
                  brandId: brandCategoryData.brandId,
                  page: page,
                  limit: limit,
                  search: search,
                  handleClose: handleClose
                })
              );
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
