import { useContext } from "react";
import { UIContext } from "../../../context/UIContext.jsx";
import api from "../../../api/api.js";
import { IoIosSearch } from "react-icons/io";
import './SearchInput.css'


function SearchInput() {
  const { setSearchedData, setFreezeST, setIsLoading, searchTerm, setSearchTerm } =
    useContext(UIContext);

  const handleSearchTerm = (e) => {
    setSearchTerm(e.target.value);
  };

  const getSearchedData = async (query) => {
    const q = query.trim();
    if (!q) return;

    setIsLoading(true);
    setFreezeST(q);

    try {
      const res = await api.get("/products/search", { params: { q } });

      const uniqueProducts = Array.from(
        res.data.data.reduce((map, item) => {
            const productName = item.productName;
            if (!map.has(productName)) {
              map.set(productName, {
                ...item,
                availableColors: item.colorImage ? [item.colorImage] : [],
              });
            } else {
              const existing = map.get(productName);
              if (item.colorImage && !existing.availableColors.includes(item.colorImage)) {
                existing.availableColors.push(item.colorImage);
              }
            }
            return map;
          }, new Map())
          .values()
      );
     
      setSearchedData(uniqueProducts);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (e.key === "Enter") {
      getSearchedData(searchTerm);
    }
  };

  return (
    <div className="search-for-search-container p-2 mt-5 mx-auto px-2 px-lg-3 rounded-1 user-select-none d-flex align-items-center">
      <IoIosSearch className="search-icon-for-search" />
      <input
        type="text"
        placeholder="Search"
        className="flex-1 d-flex w-100 border-0"
        style={{ outline: "none" }}
        value={searchTerm}
        onChange={handleSearchTerm}
        onKeyDown={handleSubmit}
      />
      <div
        className="delete-search-query-container text-uppercase text-dark text-decoration-underline fw-bold"
        onClick={() => setSearchTerm("")}
      >
        clear
      </div>
    </div>
  );
}

export default SearchInput;