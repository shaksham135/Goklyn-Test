import React from 'react';


const Portfolio = ({ projects = [] }) => {
    return (
        <section className="portfolio_section py-5">
            <div className="container">
                <div className="row pb-3">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12 text-center">
                        <h2 className="text-white">Projects</h2>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {projects.length > 0 ? (
                        projects.map(project => {
                            // Determine primary link for View Project
                            const githubUrl = project.githubUrl && !/^(https?:\/\/)/i.test(project.githubUrl)
                                ? `https://${project.githubUrl}`
                                : project.githubUrl;
                            const primaryLink = githubUrl || project.projectUrl;

                            return (
                                <div key={project._id} className="service_item col-lg-4 col-md-6 col-sm-12 mb-4">
                                    <div className="border rounded p-4 shadow-lg bg-black text-white h-100" style={{borderRadius : '10px'}}>
                                        {project.photo && <img src={project.photo} alt={project.title} className="img-fluid mb-3" style={{borderRadius: '5px', width: '100%', height: '200px', objectFit: 'cover'}}/>}
                                        <h4 className="mb-3 text-primary">{project.title}</h4>
                                        <p>{project.description}</p>
                                        <div>
                                            {project.tags.map(tag => (
                                                <span key={tag} className="badge bg-secondary me-2">{tag}</span>
                                            ))}
                                        </div>
                                        {primaryLink && (
                                            <div className="mt-3">
                                                <a href={primaryLink} target="_blank" rel="noopener noreferrer" 
                                                   className="btn btn-primary btn-sm" style={{minWidth:'120px'}}>
                                                    View Project
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-white">No projects to display at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
