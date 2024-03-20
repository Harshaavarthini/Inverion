import React, { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  MenuItem,
  Select,
  Input,
  TextField,
  Box,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "../../assets/css/Admin.css";

export const InvHome = () => {
  const [rows, rowchange] = useState([]);
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(5);
  const [open, setOpen] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState(null);
  const [formdata, setFormData] = useState({
    productId: "",
    productName: "",
    productCategory: "",
    productCondition: "",
    expiry: "",
    priority: "",
    deliveryStatus: "",
    assignedAgent: "",
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const config = {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.APP_API_BASE_URL}/inventoryteam/getall`, config)
      .then((response) => {
        rowchange(response.data);
      })
      .catch((error) => {
        console.log(error.data);
      });
  }, []);

  const columns = [
    { name: "ID", id: "productId" },
    { name: "Name", id: "productName" },
    { name: "Category", id: "productCategory" },
    { name: "Condition", id: "productCondition" },
    { name: "Expiry", id: "expiry" },
    { name: "Priority", id: "priority" },
    { name: "Status", id: "deliveryStatus" },
    { name: "Agent", id: "assignedAgent" },
    { name: "Actions", id: "actions" },
  ];

  const handlechangepage = (event, newpage) => {
    pagechange(newpage);
  };

  const handleRowsPerPage = (event) => {
    rowperpagechange(+event.target.value);
    pagechange(0);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIdToUpdate(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const showAlert = (message, severity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
  };

  const renderActions = (row) => {
    const { productId, deliveryStatus } = row;
    return (
      <TableCell>
        <Button
          className="buttons"
          sx={{ mx: "8px" }}
          variant="contained"
          color="primary"
          onClick={() => handleUpdate(productId)}
        >
          Update
        </Button>
        <Button
          className="buttons"
          variant="contained"
          color="warning"
          onClick={() => handleDelete(productId)}
        >
          Delete
        </Button>
        {deliveryStatus === "OUT FOR DELIVERY" && (
          <Button
            className="buttons"
            sx={{ mx: "8px" }}
            variant="contained"
            color="success"
            onClick={() => handleTrack(row)}
          >
            Track
          </Button>
        )}
      </TableCell>
    );
  };

  const handleUpdate = async (productId) => {
    console.log(productId);
    try {
      const response = await axios.get(
        `${
          import.meta.env.APP_API_BASE_URL
        }/inventoryteam/getproduct/${productId}`,
        config
      );
      setIdToUpdate(productId);
      setOpen(true);
      setFormData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (productId) => {
    axios
      .delete(
        `${import.meta.env.APP_API_BASE_URL}/inventoryteam/delete/${productId}`,
        config
      )
      .then((response) => {
        alert(response.data);
        const updatedRows = rows.filter((row) => row.productId !== productId);
        rowchange(updatedRows);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTrack = (row) => {
    alert("track");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(
        `${import.meta.env.APP_API_BASE_URL}/inventoryteam/uplaodfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formdata, [name]: value });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar />
      <h1 style={{ color: "#005580", margin: "0.5rem" }}>INVENTORY</h1>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        m={2}
      >
        <Box>
          <Button
            className="buttons"
            variant="contained"
            onClick={handleClickOpen}
            color="primary"
          >
            ADD PRODUCT
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              component: "form",
              onSubmit: async (event) => {
                event.preventDefault();
                try {
                  if (idToUpdate) {
                    await axios.post(
                      `${
                        import.meta.env.APP_API_BASE_URL
                      }/inventoryteam/update`,
                      formdata,
                      config
                    );
                  } else {
                    await axios.post(
                      `${
                        import.meta.env.APP_API_BASE_URL
                      }/inventoryteam/addProduct`,
                      formdata,
                      config
                    );
                  }
                  handleClose();
                } catch (error) {
                  console.log(error);
                }
              },
            }}
          >
            <DialogTitle>
              {idToUpdate ? "Update Product" : "Add Product"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {idToUpdate
                  ? "Update the details of the product"
                  : "Fill the details to add the product to the inventory"}
              </DialogContentText>
              <TextField
                autoFocus
                required
                margin="normal"
                id="productId"
                name="productId"
                label="PRODUCT ID"
                fullWidth
                variant="outlined"
                size="small"
                value={formdata.productId}
                onChange={handleFormChange}
              />
              <TextField
                autoFocus
                required
                margin="normal"
                id="productName"
                name="productName"
                label="PRODUCT NAME"
                type="text"
                fullWidth
                variant="outlined"
                sx={{ mb: 3 }}
                size="small"
                value={formdata.productName}
                onChange={handleFormChange}
              />
              <FormControl fullWidth>
                <InputLabel id="productCategory-label">
                  PRODUCT CATEGORY
                </InputLabel>
                <Select
                  labelId="productCategory-label"
                  id="productCategory"
                  name="productCategory"
                  label="Product Category"
                  value={formdata.productCategory}
                  onChange={handleFormChange}
                  sx={{ mb: 2 }}
                  size="small"
                >
                  <MenuItem value="Health and Wellness">
                    Health and Wellness
                  </MenuItem>
                  <MenuItem value="Outdoor and Sports">
                    Outdoor and Sports
                  </MenuItem>
                  <MenuItem value="emergency products">
                    emergency products
                  </MenuItem>
                  <MenuItem value="glassware">glassware</MenuItem>
                  <MenuItem value="Electronics">Home Improvemnt</MenuItem>
                  <MenuItem value="essentials">essentials</MenuItem>
                  <MenuItem value="Electronics">Electronics</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="productCondition-label">
                  PRODUCT CONDITION
                </InputLabel>
                <Select
                  labelId="productCondition-label"
                  id="productCondition"
                  name="productCondition"
                  label="PRODUCT CONDITION"
                  value={formdata.productCondition}
                  onChange={handleFormChange}
                  size="small"
                >
                  <MenuItem value="DAMAGED">DAMAGED</MenuItem>
                  <MenuItem value="NOT DAMAGED">NOT DAMAGED</MenuItem>
                </Select>
              </FormControl>

              <TextField
                autoFocus
                required
                margin="normal"
                id="expiry"
                name="expiry"
                label="EXPIRY"
                type="date"
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                size="small"
                value={formdata.expiry}
                onChange={handleFormChange}
              />

              <FormControl fullWidth>
                <InputLabel id="priority-label">PRIORITY</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  label="PRIORITY"
                  value={formdata.priority}
                  onChange={handleFormChange}
                  sx={{ mb: 2 }}
                  size="small"
                >
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="Regular">Regular</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="deliveryStatus-label">
                  DELIVERY STATUS
                </InputLabel>
                <Select
                  labelId="deliveryStatus-label"
                  id="deliveryStatus"
                  name="deliveryStatus"
                  label="DELIVERY STATUS"
                  value={formdata.deliveryStatus}
                  onChange={handleFormChange}
                  sx={{ mb: 1 }}
                  size="small"
                >
                  <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                  <MenuItem value="PENDING">PENDING</MenuItem>
                  <MenuItem value="NOT DELIVERED">NOT DELIVERED</MenuItem>
                  <MenuItem value="RETURNED">RETURNED</MenuItem>
                  <MenuItem value="DELAYED">DELAYED</MenuItem>
                  <MenuItem value="IN WAREHOUSE">IN WAREHOUSE</MenuItem>
                  <MenuItem value="OUT FOR DELIVERY">OUT FOR DELIVERY</MenuItem>
                </Select>
              </FormControl>

              <TextField
                autoFocus
                margin="normal"
                id="assignedAgent"
                name="assignedAgent"
                label="ASSIGNED AGENT"
                type="text"
                fullWidth
                sx={{ mb: 2 }}
                variant="outlined"
                size="small"
                value={formdata.assignedAgent}
                onChange={handleFormChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">{idToUpdate ? "Update" : "Add"}</Button>
            </DialogActions>
          </Dialog>
        </Box>

        <Box>
          <Input
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="upload-file"
          />
          <label htmlFor="upload-file">
            <Button
              component="span"
              variant="contained"
              color="primary"
              onClick={(event) => event.stopPropagation()}
            >
              Upload File
            </Button>
          </label>
        </Box>
      </Box>
      <Paper sx={{ width: "98%", marginLeft: "2%", marginRight: "2%" }}>
        <TableContainer sx={{ maxHeight: 525 }} className="table">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    // style={{ backgroundColor: "black", color: "white" }}
                    key={column.id}
                  >
                    {column.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((row, i) => {
                    return (
                      <TableRow key={row.productId}>
                        {columns.map((column, columnIndex) => {
                          if (column.id === "actions") {
                            return renderActions(row);
                          } else {
                            let value = row[column.id];
                            return (
                              <TableCell key={`${column.id}-${row.productId}`}>
                                {value}
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={rows.length}
          component="div"
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </Paper>
      {alertMessage && (
        <Alert
          variant="filled"
          severity={alertSeverity}
          onClose={() => setAlertMessage(null)}
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "25%",
            height: "auto",
            maxHeight: "200px",
            overflow: "auto",
            padding: "10px",
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </div>
  );
};
