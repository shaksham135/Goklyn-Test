import React, { useState, useEffect } from 'react';
import api from '../../api';

const CrudForm = ({ section, item, onSuccess, onCancel }) => {
  // Set up initial state based on section
  const [form, setForm] = useState({
    title: '',
    name: '', // Maps to clientName in backend
    company: '',
    quote: '', // Maps to feedback in backend
    description: '',
    eligibility: '',
    isOpen: true,
    photo: null,
    tags: '',
    githubUrl: '',
    projectUrl: '',
    rating: 5
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      // Map backend fields to form fields
      const mappedItem = {
        ...item,
        name: item.clientName || item.name || '',
        quote: item.feedback || item.quote || ''
      };
      setForm(prev => ({
        ...prev,
        ...mappedItem
      }));
    }
    // eslint-disable-next-line
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      let res;
      const formData = new FormData();
      
      // Handle form data based on section
      if (section === 'projects') {
        formData.append('title', form.title);
        formData.append('description', form.description);
        if (form.tags) formData.append('tags', form.tags);
        if (form.githubUrl) formData.append('githubUrl', form.githubUrl);
        if (form.projectUrl) formData.append('projectUrl', form.projectUrl);
        if (form.photo) formData.append('photo', form.photo);
      } 
      else if (section === 'testimonials') {
        formData.append('clientName', form.name);
        formData.append('company', form.company || '');
        formData.append('feedback', form.quote);
        // Convert rating to a number before sending
        formData.append('rating', Number(form.rating));
        if (form.photo) formData.append('photo', form.photo);
        // Set approved to true by default for admin submissions
        formData.append('approved', 'true');
      } 
      else if (section === 'internships') {
        formData.append('title', form.title);
        formData.append('description', form.description);
        if (form.eligibility) formData.append('eligibility', form.eligibility);
        formData.append('isOpen', form.isOpen);
        if (form.photo) formData.append('photo', form.photo);
      }

      if (item && item._id) {
        // Update
        if (section === 'projects') {
          await api.post(`/api/projects/update/${item._id}`, formData);
        } else if (section === 'testimonials') {
          res = await api.post(`/api/testimonials/update-with-photo/${item._id}`, formData);
        } else if (section === 'internships') {
          await api.post(`/api/internships/update-with-photo/${item._id}`, formData);
        }
      } else {
        // Add new
        if (section === 'projects') {
          await api.post(`/api/${section}`, formData);
        } else if (section === 'testimonials') {
          await api.post('/api/testimonials/add', formData);
        } else if (section === 'internships') {
          await api.post('/api/internships/add', formData);
        }
      }
      setMessage('Saved successfully!');
      setTimeout(() => {
        setLoading(false);
        onSuccess();
      }, 800);
    } catch (err) {
      setLoading(false);
      setMessage('Error saving data.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-dark text-white p-4 rounded mb-3">
      {/* Render fields based on section */}
      {section === 'projects' && (
        <>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Tags (comma separated)</label>
            <input 
              type="text" 
              name="tags" 
              value={form.tags} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="e.g., React, Node.js, MongoDB"
            />
            <div className="form-text">Separate multiple tags with commas</div>
          </div>
          <div className="mb-3">
            <label className="form-label">Live Demo URL</label>
            <input 
              type="url" 
              name="projectUrl" 
              value={form.projectUrl} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://yourproject.com"
            />
            <div className="form-text">Link to the project's live demo (if available)</div>
          </div>
          <div className="mb-3">
            <label className="form-label">GitHub URL <span style={{color: 'red'}}>*</span></label>
            <input 
              type="url" 
              name="githubUrl" 
              value={form.githubUrl} 
              onChange={handleChange} 
              className="form-control" 
              placeholder="https://github.com/username/repository"
              required
            />
            <div className="form-text">This field is required. Link to the project's GitHub repository</div>
          </div>
        </>
      )}
      {section === 'testimonials' && (
        <>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <select 
              name="rating" 
              value={form.rating} 
              onChange={handleChange} 
              className="form-select"
              required
            >
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Quote</label>
            <textarea name="quote" value={form.quote} onChange={handleChange} className="form-control" required rows="4" />
          </div>
        </>
      )}
      {section === 'internships' && (
        <>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="form-control" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Eligibility</label>
            <textarea name="eligibility" value={form.eligibility} onChange={handleChange} className="form-control" />
          </div>
          <div className="mb-3 form-check">
            <input type="checkbox" name="isOpen" checked={form.isOpen} onChange={handleChange} className="form-check-input" id="isOpen" />
            <label className="form-check-label" htmlFor="isOpen">Position is Open</label>
          </div>
        </>
      )}
      <div className="mb-3">
        <label className="form-label">Photo (optional)</label>
        <input type="file" name="photo" onChange={handleChange} className="form-control" />
      </div>
      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-success" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </form>
  );
};

export default CrudForm;
