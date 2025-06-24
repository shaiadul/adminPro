import React from "react";

export default function Pagination({
  currentPage,
  dataPerPage,
  totalItems,
  paginate,
  showingText,
  data,
}) {
  const pageNumbers = [];
  const lastPage = Math.ceil(totalItems / dataPerPage);

  for (let i = 1; i <= lastPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-y-3 my-10">
      {/* page number */}
      <div className="flex justify-start items-center font-semibold">
        {showingText}
      </div>
      {/* Pagination */}
      <div className="flex justify-end items-center">
        <nav aria-label="Pagination">
          <ul className="inline-flex border rounded-sm shadow-md">
            <li>
              <button
                className="py-2 px-4 text-gray-700 bg-gray-100 focus:outline-none"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &#x2190;
              </button>
            </li>

            <li>
              {currentPage > 1 && (
                <button
                  onClick={() => paginate(currentPage - 1)}
                  className={`py-2 px-4 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none`}
                >
                  {currentPage - 1}
                </button>
              )}
              <button
                className={`py-2 px-4 text-gray-700 bg-gray-100 focus:outline-none`}
              >
                {currentPage}
              </button>
              {currentPage < lastPage && (
                <button
                  onClick={() => paginate(currentPage + 1)}
                  className={`py-2 px-4 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none`}
                >
                  {currentPage + 1}
                </button>
              )}

              <span
                className={`py-2 px-4 bg-white text-gray-700 focus:outline-none cursor-not-allowed`}
              >
                ...
              </span>

              <button
                onClick={() => paginate(lastPage)}
                className={`py-2 px-4 bg-white text-gray-700 hover:bg-gray-100 focus:outline-none`}
              >
                {lastPage}
              </button>
            </li>

            <li>
              <button
                className="py-2 px-4 text-gray-700 bg-gray-100 focus:outline-none"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                &#x2192;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
