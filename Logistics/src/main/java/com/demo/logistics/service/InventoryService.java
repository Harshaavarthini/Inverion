package com.demo.logistics.service;

import com.demo.logistics.Message.ProductResponse;
import com.demo.logistics.entity.Inventory;
import com.demo.logistics.entity.InventoryCsvRepresentation;
import com.demo.logistics.repository.InventoryRepo;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryService {

    @Autowired
    private InventoryRepo inventoryRepo;

    public void addProduct(Inventory inventory) {
        inventoryRepo.save(inventory);
    }

    public ProductResponse deleteInventory(String id) {
        inventoryRepo.deleteByProductId(id);
        return new ProductResponse("PRODUCT DELETED", "SUCCESS");
    }

    public List<Inventory> getAllProducts() {
        return inventoryRepo.findAll();
    }

    public Integer uploadFile(MultipartFile file) throws IOException {
        Set<Inventory>  inventorySet = parseCSV(file);
        inventoryRepo.saveAll(inventorySet);
        return inventorySet.size();
    }

    private Set<Inventory> parseCSV(MultipartFile file) throws IOException {
        try(Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            HeaderColumnNameMappingStrategy<InventoryCsvRepresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(InventoryCsvRepresentation.class);
            CsvToBean<InventoryCsvRepresentation> csvToBean = new CsvToBeanBuilder<InventoryCsvRepresentation>(reader)
                    .withMappingStrategy(strategy)
                    .withIgnoreEmptyLine(true)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();
            return csvToBean.parse().stream()
                    .map(csvLine->Inventory.builder()
                            .productName(csvLine.getProductName())
                            .productCategory(csvLine.getProductCategory())
                            .expiry(csvLine.getExpiry())
                            .assignedAgent(csvLine.getAssignedAgent())
                            .deliveryStatus(csvLine.getDeliveryStatus())
                            .priority(csvLine.getPriority())
                            .productId(csvLine.getProductId())
                            .productCondition(csvLine.getProductCondition())
                            .build()
                    )
                            .collect(Collectors.toSet());
        }

    }

    public ProductResponse updateProduct(String productId, String productCondition, String deliveryStatus) {
        inventoryRepo.updateProduct(productId, productCondition,deliveryStatus);

        return new ProductResponse("UPDATED SUCCESSFULLY", "SUCCESS");
    }



    public List<Inventory> getTodayDelivery(String agent) {
        return inventoryRepo.getTodayDelivery(agent);
    }

    public List<Inventory> getPastDelivery(String agent) {
        return inventoryRepo.getPastDelivery(agent);
    }

    public List<Inventory> getPendingDelivery(String agent) {
        return inventoryRepo.getPendingDelivery(agent);
    }

    public ProductResponse updateStatus(String status, String id) {
        inventoryRepo.updateStatus(status, id);
        return  new ProductResponse("UPDATED SUCCESSFULLY", "SUCCESS");
    }

    public Inventory update(Inventory product) {
        Inventory pro  =  inventoryRepo.findByProductId(product.getProductId());
        pro.setId(product.getId());
        pro.setExpiry(product.getExpiry());
        pro.setPriority(product.getPriority());
        pro.setAssignedAgent(product.getAssignedAgent());
        pro.setProductCondition(product.getProductCondition());
        pro.setProductCategory(product.getProductCategory());
        pro.setProductName(product.getProductName());
        pro.setDeliveryStatus(product.getDeliveryStatus());

        return inventoryRepo.save(pro);
    }

    public Inventory getProduct(String productId) {
        return inventoryRepo.findByProductId(productId);
    }

    public List<Inventory> getAllByAgent(String agent) {
        return inventoryRepo.findAllByAssignedAgent(agent);
    }
}
