import React, { useState, useEffect } from 'react';
import api from '../api';

import ProjectBanner from '../components/Projects/ProjectBanner';
import Portfolio from '../components/common/Portfolio';
import Tastimonial from '../components/common/Tastimonial';
import Meet from '../components/common/Meet';


const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/api/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <>

            <ProjectBanner />
            {loading ? (
                <div className="container text-center py-5">
                    <p className="text-white">Loading projects...</p>
                </div>
            ) : (
                <Portfolio projects={projects} />
            )}
            
            <Tastimonial />
            <Meet />

        </>
    );
};

export default ProjectPage;