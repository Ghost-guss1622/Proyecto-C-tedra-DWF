@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService service;

    @GetMapping
    public List<Inventory> getAll() { return service.findAll(); }

    @GetMapping("/{id}")
    public Inventory getById(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    public Inventory save(@RequestBody Inventory inv) { return service.saveInventory(inv); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.deleteInventory(id); }
}
