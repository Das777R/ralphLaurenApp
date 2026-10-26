import { Form, InputGroup, Button, ButtonGroup } from "react-bootstrap";
import { FiSearch, FiGrid, FiList, FiTrash2 } from "react-icons/fi";
import { useProductMedia } from "../../../../../context/admin/ProductMediaContext";
import { CATEGORIES } from "../../../../../context/admin/constants";

export default function ProductToolbar() {
  const {
    items,
    kindFilter,
    setKindFilter,
    kindOptions,
    categoryOptions,
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

  const countByCategory = Object.fromEntries(
    (categoryOptions || []).map((c) => [c.name, c.count])
  );

  const categoryButtons = [
    ...CATEGORIES,
    ...(categoryOptions || [])
      .map((c) => c.name)
      .filter((n) => !CATEGORIES.includes(n)),
  ].map((name) => ({
    name,
    count: countByCategory[name] || 0,
  }));

  return (
    <div className="ui-card mb-3">
      {/* Category tabs */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 border-bottom">
        <div className="d-flex flex-nowrap gap-2 overflow-auto">
          <button
            type="button"
            onClick={() => setCategoryFilter("")}
            className={`btn btn-sm flex-shrink-0 ${
              categoryFilter === "" ? "btn-ink" : "btn-outline-secondary"
            }`}
          >
            All categories ({items.length})
          </button>
          {categoryButtons.map(({ name, count }) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategoryFilter(name)}
              className={`btn btn-sm flex-shrink-0 ${
                categoryFilter === name ? "btn-ink" : "btn-outline-secondary"
              }`}
            >
              {name} ({count})
            </button>
          ))}
        </div>

        <ButtonGroup size="sm">
          <Button
            className={view === "grid" ? "btn-ink" : ""}
            variant={view === "grid" ? undefined : "outline-secondary"}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <FiGrid size={16} />
          </Button>
          <Button
            className={view === "list" ? "btn-ink" : ""}
            variant={view === "list" ? undefined : "outline-secondary"}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <FiList size={16} />
          </Button>
        </ButtonGroup>
      </div>

      {/* Search + filters */}
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

        <Form.Select
          className="toolbar-select"
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value)}
        >
          <option value="All">All kinds</option>
          {(kindOptions || []).map(({ name, count }) => (
            <option key={name} value={name}>
              {name} ({count})
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className="toolbar-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
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

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="d-flex align-items-center justify-content-between px-3 py-2 bg-primary bg-opacity-10 border-top">
          <span className="small fw-semibold">{selected.size} selected</span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={clearSelection}
            >
              Clear
            </Button>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setConfirmIds([...selected])}
            >
              <FiTrash2 size={14} className="me-1" /> Delete selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}