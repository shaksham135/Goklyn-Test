import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const EditTestimonialPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [quote, setQuote] = useState('');
    const [company, setCompany] = useState('');
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchTestimonial = async () => {
            try {
                const response = await api.get(`/api/testimonials/${id}`);
                const testimonial = response.data;
                setName(testimonial.name);
                setQuote(testimonial.quote);
                setCompany(testimonial.company || '');
                setCurrentPhoto(testimonial.photo);
            } catch (error) {
                setMessage('Error fetching testimonial data. A route to get a single testimonial might be needed.');
                console.error('Fetch error:', error);
            }
        };
        fetchTestimonial();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('quote', quote);
        formData.append('company', company);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            await api.post(`/api/testimonials/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('Testimonial updated successfully!');
            setTimeout(() => navigate('/admin/manage-testimonials'), 1500);
        } catch (error) {
            setMessage(error.response?.data?.msg || 'An error occurred during update');
            console.error('Update error:', error);
        }
    };

    return (
        <div className="container py-5 mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card bg-dark text-white">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Edit Testimonial</h2>
                            <form onSubmit={handleSubmit}>
                                {currentPhoto && <img src={`http://localhost:5000${currentPhoto}`} alt="Current testimonial" className="img-fluid rounded-circle mx-auto d-block mb-3" style={{width: '150px', height: '150px', objectFit: 'cover'}}/>}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quote" className="form-label">Quote</label>
                                    <textarea className="form-control" id="quote" rows="4" value={quote} onChange={(e) => setQuote(e.target.value)} required></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="company" className="form-label">Company / Position</label>
                                    <input type="text" className="form-control" id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="photo" className="form-label">Replace Photo (optional)</label>
                                    <input type="file" className="form-control" id="photo" onChange={(e) => setPhoto(e.target.files[0])} />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary">Update Testimonial</button>
                                </div>
                            </form>
                            {message && <p className="mt-3 text-center text-info">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTestimonialPage;
