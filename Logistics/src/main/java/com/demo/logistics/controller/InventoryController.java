package com.demo.logistics.controller;

import com.demo.logistics.Message.ProductResponse;
import com.demo.logistics.entity.Inventory;
import com.demo.logistics.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/inventoryteam")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;


    @PostMapping("/addProduct")
    public String addProduct(@RequestBody Inventory inventory){
        inventoryService.addProduct(inventory);
        return "Product added succesfully";
    }


    @Transactional
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable String id){
        ProductResponse productResponse = inventoryService.deleteInventory(id);
        if(productResponse.getStatus().equals("SUCCESS")){
            return new ResponseEntity<>(productResponse.getMessage(), HttpStatus.OK);
        }
        return new ResponseEntity<>(productResponse.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @GetMapping("/getall")
    public List<Inventory>  getAllProducts(){
        return inventoryService.getAllProducts();
    }

    @PostMapping(value = "/uplaodfile" , consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> uploadInventoryFile(
            @RequestPart("file")MultipartFile file
            ) throws IOException{
        return ResponseEntity.ok(inventoryService.uploadFile(file));
    }


    @PostMapping("/update")
    public String updateInventory(@RequestBody Inventory inventory){
        inventoryService.update(inventory);
        return "Product updated successfully";
    }
    @GetMapping("/getproduct/{productId}")
    public Inventory getProduct(@PathVariable String productId) {
        return inventoryService.getProduct(productId);
    }
}
