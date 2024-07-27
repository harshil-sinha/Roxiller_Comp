import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month, setMonth }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/transactions', {
                    params: { month, search, page }
                });
                setTransactions(response.data.transactions);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchData();
    }, [month, search, page]);

    return (
        <div className="container mt-4">
            <h1 className='text-center mb-4 rounded-heading'>Transaction Dashboard</h1>
            <div className="d-flex justify-content-between mb-4">
                <input
                    type="text"
                    className="form-control mr-2"
                    style={{ maxWidth: '250px' }}
                    placeholder="Search transactions"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="form-control"
                    style={{ maxWidth: '150px' }}
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                >
                    {[...Array(12).keys()].map(i => (
                        <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>
            </div>
            <div className="table-responsive">
                <table className="table table-warning table-bordered bg-warning text-center table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Date of Sale</th>
                            <th>Category</th>
                            <th>Sold</th>
                            <th>Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{transaction.id}</td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td>${transaction.price.toFixed(2)}</td>
                                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.sold ? 'Yes' : 'No'}</td>
                                <td>
                                    {transaction.image ? (
                                        <img
                                            src={transaction.image}
                                            alt={transaction.title}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <nav className='d-flex justify-content-center mt-3'>
                <ul className="pagination">
                    <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page => Math.max(page - 1, 1))}>
                            Previous
                        </button>
                    </li>
                    <li className="page-item disabled">
                        <span className="page-link">Page {page} of {totalPages}</span>
                    </li>
                    <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setPage(page => Math.min(page + 1, totalPages))}>
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default TransactionsTable;
