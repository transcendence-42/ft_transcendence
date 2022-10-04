import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import MatchHistory from './MatchHistory';

const PaginatedMatchHistory = ({ items, itemsPerPage, userId }: any) => {

  /** *********************************************************************** */
  /** STATES                                                                  */
  /** *********************************************************************** */
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    // fetch items from props.
    const endOffset = itemOffset + itemsPerPage;
    if (items) {
      setCurrentItems(items.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items.length / itemsPerPage));
    }
  }, [itemOffset, itemsPerPage, items]);

  // Invoke when user click to request another 'page'.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <MatchHistory matchesList={currentItems} id={+userId} />
      {items && items.length > itemsPerPage &&
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        previousLinkClassName="text-blue"
        previousClassName="me-2"
        nextLinkClassName="text-blue"
        nextClassName="ms-2"
        pageLinkClassName="text-pink"
        pageClassName="me-1 ms-1"
        activeLinkClassName="text-decoration-underline"
        containerClassName="pagination justify-content-center mb-3"
      />}
    </>
  );
}

export default PaginatedMatchHistory;
