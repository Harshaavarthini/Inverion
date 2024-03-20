package com.demo.logistics.controller;


import com.demo.logistics.Message.ProductResponse;
import com.demo.logistics.entity.Inventory;
import com.demo.logistics.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;


@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
public class AgentController {

    private final InventoryService inventoryService;
    private final LocalDate date = LocalDate.now();

    @GetMapping("/getall/{agent}")
    public List<Inventory> getAllByAgent(@PathVariable String agent){
        return inventoryService.getAllByAgent(agent);
    }



    @GetMapping("/today/{agent}")
    public List<Inventory> getTodayDelivery(@PathVariable String agent){

        return  inventoryService.getTodayDelivery(agent);
    }

    @GetMapping("/past/{agent}")
    public List<Inventory> getPastDelivery(@PathVariable String agent){

        return  inventoryService.getPastDelivery(agent);
    }


    @GetMapping("/pending/{agent}")
    public List<Inventory> getPendingDelivery(@PathVariable String agent){
        return inventoryService.getPendingDelivery(agent);
    }

    @PostMapping("/update/{id}/{status}")
    public ResponseEntity<?> updateStatus(@PathVariable String status, @PathVariable String id){
        return  new ResponseEntity<>(inventoryService.updateStatus(status, id), HttpStatus.OK);
    }


//    @PostMapping("/update")
//    public ResponseEntity<?> update(@RequestBody Inventory product){
//        return new ResponseEntity<>(inventoryService.update(product), HttpStatus.OK);
//    }

        @PostMapping("update")
    public ResponseEntity<?> updateInventory(@RequestParam String productId,
                                             @RequestParam String productCondition,
                                             @RequestParam String deliveryStatus){
        ProductResponse productResponse = inventoryService.updateProduct(productId,productCondition,deliveryStatus);
        if(productResponse.getStatus().equals("SUCCESS")){
            return new ResponseEntity<>(productResponse.getMessage(), HttpStatus.OK);
        }
        return new ResponseEntity<>(productResponse.getMessage(), HttpStatus.BAD_REQUEST);
    }

}
