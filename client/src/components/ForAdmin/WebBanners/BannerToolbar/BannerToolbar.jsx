import { Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import {
  useBanners,
  PLACEMENTS,
  getSectionsForPlacement,
} from "../../../../context/admin/webbanner/BannerContext.jsx";

export default function BannerToolbar() {
  const { query, setQuery, placement, setPlacement, section, setSection } =
    useBanners();

  const sectionOptions = getSectionsForPlacement(placement);

  const handlePlacementChange = (e) => {
    setPlacement(e.target.value);
    setSection("All");
  };

  return (
    <div className="ui-card p-3 mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <InputGroup className="toolbar-search">
          <InputGroup.Text className="bg-transparent border-end-0 text-muted">
            <FiSearch size={16} />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Search banners or brand"
            className="border-start-0 ps-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>

        <Form.Select
          className="toolbar-select"
          value={placement}
          onChange={handlePlacementChange}
        >
          <option value="All">All Placements</option>
          {Object.entries(PLACEMENTS).map(([key, p]) => (
            <option key={key} value={key}>
              {p.label}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          className="toolbar-select"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="All">All Sections</option>
          {Object.entries(sectionOptions).map(([key, s]) => (
            <option key={key} value={key}>
              {s.label}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
}