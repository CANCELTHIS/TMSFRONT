import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoryPage = () => {
  const itemsPerPage = 10; // Number of items to display per page
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

        // Check if response has the expected structure
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
  const currentPageHistory = history.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < history.length) {
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
                            ? 'text-success fw-bold' // Green for Approved
                            : record.status === 'reject'
                            ? 'text-danger fw-bold' // Red for Rejected
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
          Page {currentPage} of {Math.ceil(history.length / itemsPerPage)}
        </small>
        <button
          className="btn btn-secondary btn-sm"
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= history.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryPage;
