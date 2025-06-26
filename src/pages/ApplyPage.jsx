import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const ApplyPage = () => {
    const { internshipId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        // Check file type
        if (file.type !== 'application/pdf') {
            setMessage('Only PDF files are allowed.');
            setFormData({ ...formData, resume: null });
            return;
        }
        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            setMessage('PDF file size must be 2MB or less.');
            setFormData({ ...formData, resume: null });
            return;
        }
        setMessage('');
        setFormData({ ...formData, resume: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.resume) {
            setMessage('Please upload your resume.');
            return;
        }
        setSubmitting(true);
        setMessage('Uploading resume...');

        try {
            // Step 1: Upload the resume file
            const resumeFormData = new FormData();
            resumeFormData.append('resume', formData.resume);

            const uploadRes = await api.post('/api/upload/resume', resumeFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const resumeUrl = uploadRes.data.url; // Use Cloudinary URL directly

            setMessage('Submitting application details...');

            // Step 2: Submit the application data
            const applicationData = {
                internshipId,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                resume: resumeUrl,
            };

            await api.post('/api/applications', applicationData);

            // Success: Keep form disabled and redirect
            setMessage('Application submitted successfully! Redirecting...');
            setTimeout(() => navigate('/career'), 3000);

        } catch (error) {
            console.error('Error submitting application:', error);
            const errorMsg = error.response?.data?.msg || 'Could not submit application. Please try again.';
            setMessage(`Error: ${errorMsg}`);
            // Only re-enable the form if there's an error
            setSubmitting(false);
        }
    };

    return (
        <section className="apply-section py-5" style={{ paddingTop: '150px' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-10">
                        <div className="card bg-dark text-white p-4 p-md-5 rounded shadow-lg">
                            <div className="card-body">
                                <h2 className="text-center text-primary mb-4">Apply for Internship</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Full Name</label>
                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email Address</label>
                                        <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input type="tel" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="resume" className="form-label">Upload Resume (PDF)</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="resume"
                                            name="resume"
                                            accept="application/pdf"
                                            onChange={handleFileChange}
                                            disabled={submitting}
                                            required
                                        />
                                    </div>
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                                            {submitting ? 'Submitting...' : 'Submit Application'}
                                        </button>
                                    </div>
                                </form>
                                {message && (
                                    <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} mt-4 text-center`}>
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApplyPage;
