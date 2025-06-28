import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useAnimateOnView from './components/common/useAnimateOnView';
import HomePage from './pages/HomePage';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FaqPage from './pages/FaqPage';
import ProjectPage from './pages/ProjectPage';
import TeamPage from './pages/TeamPage';
import ContactUsPage from './pages/ContactUsPage';
import ScrollTop from './components/ScrollTop/ScrollTop';
import CareerPage from './pages/CareerPage';
import ApplyPage from './pages/ApplyPage';
import AddTestimonialPage from './pages/AddTestimonialPage';
import AddProjectPage from './pages/AddProjectPage';
import AddInternshipPage from './pages/AddInternshipPage';
import ManageProjectsPage from './pages/ManageProjectsPage';
import EditProjectPage from './pages/EditProjectPage';
import ManageInternshipsPage from './pages/ManageInternshipsPage';
import EditInternshipPage from './pages/EditInternshipPage';
import ManageTestimonialsPage from './pages/ManageTestimonialsPage';
import EditTestimonialPage from './pages/EditTestimonialPage';
import AdminDashboard from './pages/AdminDashboard';

const AppWrapper = () => {
  useAnimateOnView();
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const location = useLocation();

  // Trigger all .hover-effect elements to animate on every route change
  useEffect(() => {
    const els = document.querySelectorAll('.hover-effect');
    els.forEach(el => {
      el.classList.remove('hover-effect-animate');
      void el.offsetWidth;
      el.classList.add('hover-effect-animate');
    });
  }, [location.pathname]);

  const pageClasses = {
    "/": "banner-section-outer",
    "/about-us": "sub-banner-section-outer",
    "/services": "sub-banner-section-outer services-banner-section-outer",
    "/faqs": "sub-banner-section-outer",
    "/portfolio": "sub-banner-section-outer services-banner-section-outer",
    "/our-team": "sub-banner-section-outer",
    "/contact-us": "sub-banner-section-outer contact-banner-section-outer",
    "/career": "sub-banner-section-outer contact-banner-section-outer"
  };

  const containerClass = pageClasses[location.pathname] || "banner-section-outer";

  const isAdminRoute = location.pathname.startsWith('/admin/dashboard');

  return (
    <div className={`${containerClass} position-relative`}>
      <ScrollTop>
        <Header />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about-us' element={<AboutPage />} />
          <Route path='/services' element={<ServicesPage />} />
          <Route path='/faqs' element={<FaqPage />} />
          <Route path='/portfolio' element={<ProjectPage />} />
          <Route path='/our-team' element={<TeamPage />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/contact-us' element={<ContactUsPage />} />
          <Route path='/career' element={<CareerPage />} />
          <Route path='/apply/:internshipId' element={<ApplyPage />} />
          <Route path='/admin/add-testimonial' element={<AddTestimonialPage />} />
          <Route path='/admin/add-project' element={<AddProjectPage />} />
          <Route path='/admin/add-internship' element={<AddInternshipPage />} />
          <Route path='/admin/manage-projects' element={<ManageProjectsPage />} />
          <Route path='/admin/edit-project/:id' element={<EditProjectPage />} />
          <Route path='/admin/manage-internships' element={<ManageInternshipsPage />} />
          <Route path='/admin/edit-internship/:id' element={<EditInternshipPage />} />
          <Route path='/admin/manage-testimonials' element={<ManageTestimonialsPage />} />
          <Route path='/admin/edit-testimonial/:id' element={<EditTestimonialPage />} />
        </Routes>
        <Footer />
      </ScrollTop>
    </div>

  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
};

export default App;
