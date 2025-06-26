import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ManageTestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await api.get('/api/testimonials');
            setTestimonials(response.data);
        } catch (error) {
            setMessage('Error fetching testimonials');
            console.error('Error fetching testimonials:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                const response = await api.delete(`/api/testimonials/${id}`);
                setMessage(response.data.msg);
                fetchTestimonials(); // Refresh the list
            } catch (error) {
                setMessage(error.response?.data?.msg || 'Error deleting testimonial');
                console.error('Error deleting testimonial:', error);
            }
        }
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="text-center text-white mb-4">Manage Testimonials</h2>
            {message && <p className="text-center text-info">{message}</p>}
            <div className="list-group">
                {testimonials.length > 0 ? (
                    testimonials.map(testimonial => (
                        <div key={testimonial._id} className="list-group-item list-group-item-action bg-dark text-white mb-2 border-secondary d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1 text-primary">{testimonial.name}</h5>
                                <p className="mb-1 fst-italic">"{testimonial.quote?.substring(0, 50)}..."</p>
                                <small>{testimonial.company}</small>
                            </div>
                            <div>
                                <Link to={`/admin/edit-testimonial/${testimonial._id}`} className="btn btn-sm btn-outline-warning me-2">Edit</Link>
                                <button onClick={() => handleDelete(testimonial._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white">No testimonials found. You can add one <Link to="/admin/add-testimonial">here</Link>.</p>
                )}
            </div>
        </div>
    );
};

export default ManageTestimonialsPage;
