import { Form, InputGroup, Button, ButtonGroup } from "react-bootstrap";
import { FiSearch, FiGrid, FiList, FiTrash2 } from "react-icons/fi";
import { useProductMedia } from "../ProductMediaContext";
import { KINDS } from "../constants";

export default function ProductToolbar() {
  const {
    kindFilter,
    setKindFilter,
    view,
    setView,
    query,
    setQuery,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    allSelected,
    toggleAll,
    filtered,
    selected,
    clearSelection,
    setConfirmIds,
  } = useProductMedia();

  return (
    <div className="ui-card mb-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 border-bottom">
        <div className="d-flex flex-nowrap gap-2 overflow-auto">
          {["All", ...KINDS].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={`btn btn-sm flex-shrink-0 ${
                kindFilter === k ? "btn-ink" : "btn-outline-secondary"
              }`}
            >
              {k === "All" ? "All kinds" : k}
            </button>
          ))}
        </div>
        <ButtonGroup size="sm">
          <Button
            className={view === "grid" ? "btn-ink" : ""}
            variant={view === "grid" ? undefined : "outline-secondary"}
            onClick={() => setView("grid")}
          >
            <FiGrid size={16} />
          </Button>
          <Button
            className={view === "list" ? "btn-ink" : ""}
            variant={view === "list" ? undefined : "outline-secondary"}
            onClick={() => setView("list")}
          >
            <FiList size={16} />
          </Button>
        </ButtonGroup>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 p-3">
        <InputGroup className="toolbar-search">
          <InputGroup.Text className="bg-transparent border-end-0 text-muted">
            <FiSearch size={16} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search name, color, category…"
            className="border-start-0 ps-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>

        <Form.Control
          className="toolbar-select"
          type="text"
          placeholder="Filter category…"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />

        <Form.Select className="toolbar-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="name">Name (A–Z)</option>
          <option value="priceHigh">Price high → low</option>
        </Form.Select>

        <Form.Check
          type="checkbox"
          id="select-all-products"
          label="Select all"
          className="ms-sm-auto small"
          checked={allSelected}
          onChange={toggleAll}
          disabled={filtered.length === 0}
        />
      </div>

      {selected.size > 0 && (
        <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary bg-opacity-10 border-top">
          <span className="small fw-semibold">{selected.size} selected</span>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={clearSelection}>
              Clear
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => setConfirmIds([...selected])}>
              <FiTrash2 size={14} className="me-1" /> Delete selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}