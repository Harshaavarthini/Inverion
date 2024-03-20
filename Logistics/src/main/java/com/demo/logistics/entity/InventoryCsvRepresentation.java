package com.demo.logistics.entity;


import com.opencsv.bean.CsvBindByName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryCsvRepresentation {

    @CsvBindByName(column = "productId")
    private String productId;

    @CsvBindByName(column = "productName")
    private String productName;

    @CsvBindByName(column = "productCategory")
    private String productCategory;

    @CsvBindByName(column = "productCondition")
    private String productCondition;

    @CsvBindByName(column = "expiry")
    private String expiry;

    @CsvBindByName(column = "priority")
    private String priority;

    @CsvBindByName(column = "deliveryStatus")
    private String deliveryStatus;

    @CsvBindByName(column = "assignedAgent")
    private String assignedAgent;
}
