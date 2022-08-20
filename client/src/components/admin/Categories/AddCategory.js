import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Formik } from "formik";
import * as Yup from "yup";
import { CategoryService } from "../../../services/category-service";
import {useAlert} from "react-alert"

export default function AddCategory({ values }) {
  const { call, setCall } = values;
  const cate = { name: "" };
  const [open, setOpen] = React.useState(false);
  const alert = useAlert()
  const categoryService = new CategoryService();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        sx={{ marginBottom: "20px" }}
        variant="outlined"
        onClick={handleClickOpen}
        className="add-cate_btn"
      >
        Thêm Danh mục
      </button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thêm danh mục</DialogTitle>
        <Formik
          initialValues={cate}
          validationSchema={SignupSchema}
          onSubmit={async (values) => {
            try {
              await categoryService.newCategory(values);
              setCall(!call);
              setOpen(false);
              alert.success("Thêm thành công !")
            } catch (error) {
              console.log(error.response.data.msg);
            }
          }}
        >
          {({ errors, touched, handleSubmit, handleChange }) => (
            <>
              <DialogContent>
                <DialogContentText>Hãy nhập tên danh mục!</DialogContentText>
                <TextField
                  autoFocus
                  name="name"
                  margin="dense"
                  label="Tên danh mục"
                  type="text"
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                />
                {errors.name && touched.name && (
                  <div
                    style={{ color: "red", marginTop: "5px", fontSize: "14px" }}
                  >
                    {errors.name}
                  </div>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleSubmit}>Thêm</Button>
              </DialogActions>
            </>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Bắt buộc nhập!"),
});
