package com.demo.logistics.entity;


import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String productId;

    private String productName;

    private String productCategory;

    private String productCondition;

    private String expiry;

    private String priority;

    private String deliveryStatus;

    private String assignedAgent;
}
