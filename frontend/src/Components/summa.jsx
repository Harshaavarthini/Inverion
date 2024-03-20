// // import React from "react";

// // export const AgentHome = () => {
// //   return (<div>AgentHome</div>);
// // };

// import {
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TablePagination,
//     TableRow,
//     Button,
//     MenuItem,
//     Select,
//     Input,
//     TextField,
//     Box,
//     InputLabel,
//     FormControl,
//   } from "@mui/material";
//   import Dialog from "@mui/material/Dialog";
//   import DialogActions from "@mui/material/DialogActions";
//   import DialogContent from "@mui/material/DialogContent";
//   import DialogContentText from "@mui/material/DialogContentText";
//   import DialogTitle from "@mui/material/DialogTitle";
//   import { useEffect, useState } from "react";
//   import axios from "axios";

//   export const AgentHome = () => {
//     const [rows, rowchange] = useState([]);
//     const [page, pagechange] = useState(0);
//     const [rowperpage, rowperpagechange] = useState(5);
//     const [open, setOpen] = useState(false);

//     const getToken = () => {
//       return localStorage.getItem("token");
//     };

//     const config = {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//         "Content-Type": "application/json",
//       },
//     };

//     useEffect(() => {
//       axios
//         .get(`${import.meta.env.APP_API_BASE_URL}/inventoryteam/getall`, config)
//         .then((response) => {
//           rowchange(response.data);
//         })
//         .catch((error) => {
//           console.log(error.data);
//         });
//     }, []);

//     const columns = [
//       { name: "ID", id: "productId" },
//       { name: "Name", id: "productName" },
//       { name: "Category", id: "productCategory" },
//       { name: "Condition", id: "productCondition" },
//       { name: "Expiry", id: "expiry" },
//       { name: "Priority", id: "priority" },
//       { name: "Status", id: "deliveryStatus" },
//       { name: "Agent", id: "assignedAgent" },
//       { name: "Actions", id: "actions" },
//     ];

//     const handlechangepage = (event, newpage) => {
//       pagechange(newpage);
//     };

//     const handleRowsPerPage = (event) => {
//       rowperpagechange(+event.target.value);
//       pagechange(0);
//     };

//     const handleClickOpen = () => {
//       setOpen(true);
//     };

//     const handleClose = () => {
//       setOpen(false);
//     };

//     const renderActions = (row) => {
//       const { deliveryStatus, productId, productCondition } = row;
//       return (
//         <TableCell>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() =>
//               handleUpdate(productId, productCondition, deliveryStatus)
//             }
//           >
//             Update
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={() => handleDelete(productId)}
//           >
//             Delete
//           </Button>
//           {deliveryStatus === "OUT FOR DELIVERY" && (
//             <Button
//               variant="contained"
//               color="secondary"
//               onClick={() => handleTrack(row)}
//             >
//               Track
//             </Button>
//           )}
//         </TableCell>
//       );
//     };

//     const handleUpdate = (productId, productCondition, deliveryStatus) => {
//       axios
//         .post(
//           `${
//             import.meta.env.APP_API_BASE_URL
//           }/inventoryteam/update?productId=${productId}&deliveryStatus=${deliveryStatus}&productCondition=${productCondition}`,
//           null,
//           config
//         )
//         .then((response) => {
//           alert(response.data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     };

//     const handleDelete = (productId) => {
//       //alert("delete");
//       axios
//         .delete(
//           `${import.meta.env.APP_API_BASE_URL}/inventoryteam/delete/${productId}`,
//           config
//         )
//         .then((response) => {
//           alert(response.data);
//           const updatedRows = rows.filter((row) => row.productId !== productId);
//           rowChange(updatedRows);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     };

//     const handleTrack = (row) => {
//       // Handle track logic
//       alert("track");
//     };

//     const handleConditionChange = (event, rowIndex) => {
//       const { value } = event.target;
//       const updatedRows = [...rows];
//       updatedRows[rowIndex].productCondition = value;
//       rowchange(updatedRows);
//     };

//     const handleStatusChange = (event, rowIndex) => {
//       const { value } = event.target;
//       const updatedRows = [...rows];
//       updatedRows[rowIndex].deliveryStatus = value;
//       rowchange(updatedRows);
//     };

//     const handleFileUpload = (event) => {
//       const file = event.target.files[0];
//       const formData = new FormData();
//       formData.append("file", file);

//       axios
//         .post(
//           `${import.meta.env.APP_API_BASE_URL}/inventoryteam/uplaodfile`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${getToken()}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         )
//         .then((response) => {
//           console.log(response.data);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     };

//     return (
//       <div style={{ textAlign: "center" }}>
//         <h1>INVENTORY</h1>
//         <Box
//           display="flex"
//           alignItems="center"
//           justifyContent="space-between"
//           m={2}
//         >
//           <Box>
//             <Button variant="contained" onClick={handleClickOpen}>
//               ADD PRODUCT
//             </Button>
//             <Dialog
//               open={open}
//               onClose={handleClose}
//               PaperProps={{
//                 component: "form",
//                 onSubmit: async (event) => {
//                   event.preventDefault();
//                   const formData = new FormData(event.currentTarget);
//                   const formJson = Object.fromEntries(formData.entries());
//                   console.log(formJson);
//                   try {
//                     const response = await axios.post(
//                       `${
//                         import.meta.env.VITE_API_BASE_URL
//                       }/inventoryteam/addProduct`,
//                       formJson
//                     );
//                     alert(response);
//                   } catch (error) {
//                     console.log(error);
//                   }

//                   handleClose();
//                 },
//               }}
//             >
//               <DialogTitle>Add Product</DialogTitle>
//               <DialogContent>
//                 <DialogContentText>
//                   Fill the details to add the product to the inventory
//                 </DialogContentText>
//                 <TextField
//                   autoFocus
//                   required
//                   margin="normal"
//                   id="productId"
//                   name="productId"
//                   label="PRODUCT ID"
//                   fullWidth
//                   variant="outlined"
//                   size="small"
//                 />
//                 <TextField
//                   autoFocus
//                   required
//                   margin="normal"
//                   id="productName"
//                   name="productName"
//                   label="PRODUCT NAME"
//                   type="text"
//                   fullWidth
//                   variant="outlined"
//                   sx={{ mb: 3 }}
//                   size="small"
//                 />
//                 <FormControl fullWidth>
//                   <InputLabel id="productCategory-label">
//                     PRODUCT CATEGORY
//                   </InputLabel>
//                   <Select
//                     labelId="productCategory-label"
//                     id="productCategory"
//                     name="productCategory"
//                     label="Product Category"
//                     defaultValue=""
//                     sx={{ mb: 2 }}
//                     size="small"
//                   >
//                     <MenuItem value="Health and Wellness">
//                       Health and Wellness
//                     </MenuItem>
//                     <MenuItem value="Outdoor and Sports">
//                       Outdoor and Sports
//                     </MenuItem>
//                     <MenuItem value="emergency products">
//                       emergency products
//                     </MenuItem>
//                     <MenuItem value="glassware">glassware</MenuItem>
//                     <MenuItem value="Electronics">Home Improvemnt</MenuItem>
//                     <MenuItem value="essentials">essentials</MenuItem>
//                     <MenuItem value="Electronics">Electronics</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <FormControl fullWidth>
//                   <InputLabel id="productCategory-label">
//                     PRODUCT CONDITION
//                   </InputLabel>
//                   <Select
//                     labelId="productCondition-label"
//                     id="productCondition"
//                     name="productCondition"
//                     label="PRODUCT CONDITION"
//                     defaultValue=""
//                     size="small"
//                   >
//                     <MenuItem value="DAMAGED">DAMAGED</MenuItem>
//                     <MenuItem value="NOT DAMAGED">NOT DAMAGED</MenuItem>
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   autoFocus
//                   required
//                   margin="normal"
//                   id="expiry"
//                   name="expiry"
//                   label="EXPIRY"
//                   type="date"
//                   fullWidth
//                   variant="outlined"
//                   sx={{ mb: 2 }}
//                   size="small"
//                 />
//                 <FormControl fullWidth>
//                   <InputLabel id="priority-label">PRIORITY</InputLabel>
//                   <Select
//                     labelId="priority-label"
//                     id="priority"
//                     name="priority"
//                     label="PRIORITY"
//                     defaultValue=""
//                     sx={{ mb: 2 }}
//                     size="small"
//                   >
//                     <MenuItem value="Premium">Premium</MenuItem>
//                     <MenuItem value="Regular">Regular</MenuItem>
//                   </Select>
//                 </FormControl>
//                 <FormControl fullWidth>
//                   <InputLabel id="deliveryStatus-label">
//                     DELIVERY STATUS
//                   </InputLabel>
//                   <Select
//                     labelId="deliveryStatus-label"
//                     id="deliveryStatus"
//                     name="deliveryStatus"
//                     label="DELIVERY STATUS"
//                     defaultValue=""
//                     sx={{ mb: 1 }}
//                     size="small"
//                   >
//                     <MenuItem value="DELIVERED">DELIVERED</MenuItem>
//                     <MenuItem value="NOT DELIVERED">NOT DELIVERED</MenuItem>
//                     <MenuItem value="RETURNED">RETURNED</MenuItem>
//                     <MenuItem value="DELAYED">DELAYED</MenuItem>
//                     <MenuItem value="IN WAREHOUSE">IN WAREHOUSE</MenuItem>
//                   </Select>
//                 </FormControl>

//                 <TextField
//                   autoFocus
//                   margin="normal"
//                   id="assignedAgent"
//                   name="assignedAgent"
//                   label="ASSIGNED AGENT"
//                   type="text"
//                   fullWidth
//                   sx={{ mb: 2 }}
//                   variant="outlined"
//                   size="small"
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleClose}>Cancel</Button>
//                 <Button type="submit">Add</Button>
//               </DialogActions>
//             </Dialog>
//           </Box>
//           <Box>
//             <Input
//               type="file"
//               onChange={handleFileUpload}
//               style={{ display: "none" }}
//               id="upload-file"
//             />
//             <label htmlFor="upload-file">
//               <Button
//                 component="span"
//                 variant="contained"
//                 color="primary"
//                 onClick={(event) => event.stopPropagation()}
//               >
//                 Upload File
//               </Button>
//             </label>
//           </Box>
//         </Box>
//         <Paper sx={{ width: "98%", marginLeft: "2%", marginRight: "2%" }}>
//           <TableContainer sx={{ maxHeight: 550 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column) => (
//                     <TableCell
//                       style={{ backgroundColor: "black", color: "white" }}
//                       key={column.id}
//                     >
//                       {column.name}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {rows &&
//                   rows
//                     .slice(page * rowperpage, page * rowperpage + rowperpage)
//                     .map((row, i) => {
//                       return (
//                         <TableRow key={row.productId}>
//                           {columns.map((column, columnIndex) => {
//                             if (column.id === "actions") {
//                               return renderActions(row);
//                             } else if (column.id === "productCondition") {
//                               return (
//                                 <TableCell key={`${column.id}-${row.productId}`}>
//                                   <Select
//                                     value={row.productCondition}
//                                     onChange={(event) =>
//                                       handleConditionChange(event, i)
//                                     }
//                                   >
//                                     <MenuItem value="DAMAGED">DAMAGED</MenuItem>
//                                     <MenuItem value="NOT DAMAGED">
//                                       NOT DAMAGED
//                                     </MenuItem>
//                                   </Select>
//                                 </TableCell>
//                               );
//                             } else if (column.id === "deliveryStatus") {
//                               return (
//                                 <TableCell key={`${column.id}-${row.productId}`}>
//                                   <Select
//                                     value={row.deliveryStatus}
//                                     onChange={(event) =>
//                                       handleStatusChange(event, i)
//                                     }
//                                   >
//                                     <MenuItem value="IN WAREHOUSE">
//                                       IN WAREHOUSE
//                                     </MenuItem>
//                                     <MenuItem value="DELAYED">DELAYED</MenuItem>
//                                     <MenuItem value="DELIVERED">
//                                       DELIVERED
//                                     </MenuItem>
//                                     <MenuItem value="OUT FOR DELIVERY">
//                                       OUT FOR DELIVERY
//                                     </MenuItem>
//                                     <MenuItem value="RETURNED">RETURNED</MenuItem>
//                                   </Select>
//                                 </TableCell>
//                               );
//                             } else {
//                               let value = row[column.id];
//                               return (
//                                 <TableCell key={`${column.id}-${row.productId}`}>
//                                   {value}
//                                 </TableCell>
//                               );
//                             }
//                           })}
//                         </TableRow>
//                       );
//                     })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             rowsPerPage={rowperpage}
//             page={page}
//             count={rows.length}
//             component="div"
//             onPageChange={handlechangepage}
//             onRowsPerPageChange={handleRowsPerPage}
//           ></TablePagination>
//         </Paper>
//       </div>
//     );
//   };
