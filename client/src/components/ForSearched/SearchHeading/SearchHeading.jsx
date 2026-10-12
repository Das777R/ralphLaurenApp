import { useContext } from "react";
import { UIContext } from "../../../context/UIContext.jsx";
import './SearchHeading.css'

function SearchHeading() {
  const { searchedData, freezeST, isLoading } = useContext(UIContext);

  let content = null;

  if (isLoading) {
    content = `Searching for "${freezeST ?? ""}"...`;
  } else if (freezeST !== null) {
    content = `${searchedData.length} Results for "${freezeST}"`;
  }

  return (
    <div className="search-fetch-info mb-3 font-monospace text-capitalize mt-4 user-select-none d-flex justify-content-start">
      {content && <h3 className="text-wrap">{content}</h3>}
    </div>
  );
}

export default SearchHeading;