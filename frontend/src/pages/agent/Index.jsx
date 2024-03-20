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
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar";
import "../../assets/css/Agent.css";

export const AgentHome = () => {
  const [rows, rowchange] = useState([]);
  const [page, pagechange] = useState(0);
  const [rowperpage, rowperpagechange] = useState(5);
  const [open, setOpen] = useState(false);
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
    const agent = localStorage.getItem("username");
    console.log(agent);
    axios
      .get(`${import.meta.env.APP_API_BASE_URL}/agent/getall/${agent}`, config)
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

  const renderActions = (row) => {
    const { deliveryStatus, productId, productCondition } = row;
    return (
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleUpdate(productId, productCondition, deliveryStatus)
          }
        >
          Update
        </Button>
      </TableCell>
    );
  };

  const handleUpdate = (productId, productCondition, deliveryStatus) => {
    axios
      .post(
        `${
          import.meta.env.APP_API_BASE_URL
        }/agent/update?productId=${productId}&deliveryStatus=${deliveryStatus}&productCondition=${productCondition}`,
        null,
        config
      )
      .then((response) => {
        alert(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleConditionChange = (event, productId) => {
    // const { value } = event.target;
    // const updatedRows = [...rows];
    // updatedRows[productId].productCondition = value;
    // rowchange(updatedRows);

    const value = event.target.value;
    const updatedRows = rows.map((row) => {
      if (row.productId === productId) {
        return { ...row, productCondition: value };
      }
      return row;
    });
    rowChange(updatedRows);
  };

  const handleStatusChange = (event, productId) => {
    // const { value } = event.target;
    // const updatedRows = [...rows];
    // updatedRows[rowIndex].deliveryStatus = value;
    // rowchange(updatedRows);
    const value = event.target.value;
    const updatedRows = rows.map((row) => {
      if (row.productId === productId) {
        return { ...row, deliveryStatus: value };
      }
      return row;
    });
    rowChange(updatedRows);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const past = async () => {
    try {
      const agent = localStorage.getItem("username");
      const response = await axios.get(
        `${import.meta.env.APP_API_BASE_URL}/agent/past/${agent}`,
        config
      );
      console.log(response.data);
      rowchange(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const pending = async () => {
    try {
      const agent = localStorage.getItem("username");
      const response = await axios.get(
        `${import.meta.env.APP_API_BASE_URL}/agent/pending/${agent}`,
        config
      );
      console.log(response.data);
      rowchange(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const today = async () => {
    try {
      const agent = localStorage.getItem("username");
      const response = await axios.get(
        `${import.meta.env.APP_API_BASE_URL}/agent/today/${agent}`,
        config
      );
      console.log(response.data);
      rowchange(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Navbar />
      <h1>INVENTORY</h1>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        m={2}
      ></Box>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Button variant="contained" onClick={today} sx={{ m: "30px" }}>
          Today Deliveries
        </Button>
        <Button variant="contained" onClick={past} sx={{ m: "30px" }}>
          Past Deliveries
        </Button>
        <Button variant="contained" onClick={pending} sx={{ m: "30px" }}>
          Pending Deliveries
        </Button>
        <Button variant="outlined" onClick={logout} sx={{ m: "30px" }}>
          Logout
        </Button>
      </div>
      <Paper sx={{ width: "98%", marginLeft: "2%", marginRight: "2%" }}>
        <TableContainer sx={{ maxHeight: 550 }} className="table">
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
                          } else if (column.id === "productCondition") {
                            return (
                              <TableCell key={`${column.id}-${row.productId}`}>
                                <Select
                                  value={row.productCondition}
                                  onChange={(event) =>
                                    handleConditionChange(event, row.productId)
                                  }
                                >
                                  <MenuItem value="DAMAGED">DAMAGED</MenuItem>
                                  <MenuItem value="NOT DAMAGED">
                                    NOT DAMAGED
                                  </MenuItem>
                                </Select>
                              </TableCell>
                            );
                          } else if (column.id === "deliveryStatus") {
                            return (
                              <TableCell key={`${column.id}-${row.productId}`}>
                                <Select
                                  value={row.deliveryStatus}
                                  onChange={(event) =>
                                    handleStatusChange(event, row.productId)
                                  }
                                >
                                  <MenuItem value="IN WAREHOUSE">
                                    IN WAREHOUSE
                                  </MenuItem>
                                  <MenuItem value="DELAYED">DELAYED</MenuItem>
                                  <MenuItem value="DELIVERED">
                                    DELIVERED
                                  </MenuItem>
                                  <MenuItem value="OUT FOR DELIVERY">
                                    OUT FOR DELIVERY
                                  </MenuItem>
                                  <MenuItem value="RETURNED">RETURNED</MenuItem>
                                  <MenuItem value="PENDING">PENDING</MenuItem>
                                </Select>
                              </TableCell>
                            );
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
    </div>
  );
};
