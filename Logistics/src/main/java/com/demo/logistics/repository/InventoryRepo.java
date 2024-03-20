package com.demo.logistics.repository;

import com.demo.logistics.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InventoryRepo extends JpaRepository<Inventory, Long> {


    void deleteByProductId(String productId);

    @Query(nativeQuery = true, value = "update inventory  set product_condition=:productCondition, delivery_status=:deliveryStatus where product_id=:productId")
    @Transactional
    @Modifying
    void updateProduct(String productId, String productCondition, String deliveryStatus);

    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and i.expiry=:expiryDate ")
    @Transactional
    @Modifying
    List<Inventory> getTodayDelivery(@Param("agent")String agent,@Param("expiryDate") LocalDate date);

//    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and i.expiry<date ")
//    @Transactional
//    List<Inventory> getPastDelivery(String agent, LocalDate date);

//    @Query(nativeQuery = true, value = "SELECT * FROM inventory i WHERE i.assigned_agent = :agent AND i.expiry < :expiryDate")
//    @Transactional
//    List<Inventory> getPastDelivery(@Param("agent") String agent, @Param("expiryDate") LocalDate expiryDate);

//    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and i.expiry<:date and i.delivery_status='Pending'")
//    @Transactional
//    List<Inventory> getPendingDelivery(String agent, LocalDate date);

    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and i.delivery_status='IN WAREHOUSE'")
    List<Inventory> getTodayDelivery(@Param("agent")String agent);

    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and i.delivery_status='DELIVERED'")
    List<Inventory> getPastDelivery(@Param("agent")String agent);

    @Query(nativeQuery = true, value = "select * from inventory i where i.assigned_agent=:agent and  i.delivery_status='PENDING'")
    @Transactional
    List<Inventory> getPendingDelivery(String agent);

    @Query(nativeQuery = true, value = "update inventory set delivery_status=:status where product_id=:id")
    @Transactional
    @Modifying
    void updateStatus(String status, String id);

    Inventory findByProductId(String productId);

    List<Inventory> findAllByAssignedAgent(String agent);
}
