import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css'; // Import the index.css for custom styles

const HistoryPage = () => {
  const itemsPerPage = 10; // Number of items to display per page
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // Added state for filtering by status

  // Get the token from localStorage
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/status-history/', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to the header
          },
        });

        console.log(response.data); // Check the structure of the response
        setHistory(response.data); // Store the response data in the state
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError('Failed to fetch history');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]); // Re-fetch data if token changes (i.e., on login)

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredHistory = history.filter(record => {
    if (filter === 'approved') return record.status === 'approve';
    if (filter === 'rejected') return record.status === 'reject';
    return true; // No filter applied
  });
  const currentPageHistory = filteredHistory.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredHistory.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="h5 mb-4">History</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filter Options */}
      <div className="mb-3">
        <button 
          className="btn btn-outline myapprove me-2 btn-success"
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button 
          className="btn btn-outline-danger myreject"
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
        <button 
          className="btn btn-outline btn-secondary  ms-2"
          onClick={() => setFilter('')}
        >
          All
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentPageHistory.length > 0 ? (
                  currentPageHistory.map((record, index) => (
                    <tr key={record.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{record.user_full_name}</td>
                      <td>{record.user_email}</td>
                      <td
                        className={
                          record.status === 'approve'
                            ? 'text-success fw-bold' // Green for Approved (from CSS)
                            : record.status === 'reject'
                            ? 'text-danger fw-bold' // Red for Rejected (from CSS)
                            : ''
                        }
                      >
                        {record.status === 'approve' ? 'Approved' : 'Rejected'}
                      </td>
                      <td>{new Date(record.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No history records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <button
          className="btn btn-secondary btn-sm"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <small>
          Page {currentPage} of {Math.ceil(filteredHistory.length / itemsPerPage)}
        </small>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= filteredHistory.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
