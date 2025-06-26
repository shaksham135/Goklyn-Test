import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const ManageProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/api/projects');
            setProjects(response.data);
        } catch (error) {
            setMessage('Error fetching projects');
            console.error('Error fetching projects:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await api.delete(`/api/projects/${id}`);
                setMessage(response.data.msg);
                fetchProjects(); // Refresh the list
            } catch (error) {
                setMessage(error.response?.data?.msg || 'Error deleting project');
                console.error('Error deleting project:', error);
            }
        }
    };

    return (
        <div className="container py-5 mt-5">
            <h2 className="text-center text-white mb-4">Manage Projects</h2>
            {message && <p className="text-center text-info">{message}</p>}
            <div className="list-group">
                {projects.length > 0 ? (
                    projects.map(project => (
                        <div key={project._id} className="list-group-item list-group-item-action bg-dark text-white mb-2 border-secondary d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-1 text-primary">{project.title}</h5>
                                <p className="mb-1">{project.description.substring(0, 100)}...</p>
                            </div>
                            <div>
                                <Link to={`/admin/edit-project/${project._id}`} className="btn btn-sm btn-outline-warning me-2">Edit</Link>
                                <button onClick={() => handleDelete(project._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white">No projects found. You can add one <Link to="/admin/add-project">here</Link>.</p>
                )}
            </div>
        </div>
    );
};

export default ManageProjectsPage;
