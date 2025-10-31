@RestController
@RequestMapping("/api/inventory/movement")
@RequiredArgsConstructor
public class InventoryMovementController {

    private final InventoryService service;

    @GetMapping("/{inventoryId}")
    public List<InventoryMovement> list(@PathVariable Long inventoryId) {
        return service.getMovements(inventoryId);
    }

    @PostMapping("/{inventoryId}")
    public InventoryMovement add(
            @PathVariable Long inventoryId,
            @RequestBody InventoryMovement mov) {
        return service.addMovement(inventoryId, mov);
    }
}
