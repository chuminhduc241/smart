import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Formik } from "formik";
import * as Yup from "yup";
import { Tooltip } from "@mui/material";
import { useAlert } from "react-alert";
import { CategoryService } from "../../../services/category-service";

export default function UpdateCategory({ values }) {
  const { call, setCall, id } = values;
  const [category, setCategory] = React.useState();
  const [open, setOpen] = React.useState(false);
  const alert = useAlert()

  const categoryService = new CategoryService();

  React.useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await categoryService.detailCategory(id);
        setCategory(res.category);
      } catch (error) {
        console.log(error);
      }
    };
    getCategory();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Sửa">
        <Button color="secondary" onClick={handleClickOpen}>
        <i className="fa-solid fa-pen"></i>
        </Button>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sửa danh mục</DialogTitle>
        <Formik
          initialValues={category}
          validationSchema={SignupSchema}
          onSubmit={async (values) => {
            try {
              await categoryService.updateCategory({
                id: values._id,
                name: values.name,
              });
              setCall(!call);
              setOpen(false);
              alert.success("Cập nhật thành công !")
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
                  defaultValue={category.name}
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
                <Button onClick={handleClose}>HỦy</Button>
                <Button onClick={handleSubmit}>Cập nhật</Button>
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
