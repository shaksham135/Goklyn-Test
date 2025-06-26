import React, { useState, useEffect } from 'react';
import api, { API_BASE_URL } from '../../api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';



const Testimonial = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get('/api/testimonials');
                setTestimonials(response.data);
            } catch (error) {
                console.error('Error fetching testimonials:', error);
            }
        };

        fetchTestimonials();
    }, []);

    const settings = {
        dots: true,
        infinite: testimonials.length > 1, // Only loop if there's more than one item
        speed: 500,
        slidesToShow: testimonials.length > 1 ? 2 : 1, // Show 2 slides if possible, otherwise 1
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: testimonials.length > 1 ? 2 : 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ],
    };

    return (
        <section className="testimonials_section">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                        <div className="testimonials_content">
                            <h6>Testimonials</h6>
                            <h2>Hear it From Our Clients</h2>
                        </div>
                    </div>
                </div>
                <div className="row" data-aos="fade-up">
                    {testimonials.length > 0 ? (
                        <Slider {...settings} className='vs-carousel'>
                            {testimonials.map(testimonial => (
                                <div key={testimonial._id} className="item px-2">
                                    <div className="testimonials_box h-100">
                                        <div className="testimonials_image">
                                            {/* Using a placeholder image for now */}
                                            <figure className="mb-0"><img src={testimonial.photo ? `${API_BASE_URL}${testimonial.photo}` : `/assets/images/testimonial_image1.png`} alt={testimonial.clientName} className="img-fluid hover-effect" /></figure>
                                            <div className="testimonials_image_content_wrappper">
                                                <p className="person_name">{testimonial.clientName}</p>
                                                <p className="testimonials_text text-size-16 mb-0">{testimonial.company}</p>
                                            </div>
                                        </div>
                                        <p className="testimonials_paragraph mb-0"><span>“</span>{testimonial.feedback}<span>”</span></p>
                                        <figure className="testimonial_apostrophy_shape position-absolute mb-0"><img src="/assets/images/testimonial_apostrophy_shape.png" alt="" className="img-fluid hover-effect" /></figure>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="col-12 text-center">
                            <p className='text-white'>No testimonials to display at the moment.</p>
                        </div>
                    )}
                </div>
                <figure className="testimonials_background_shape mb-0 position-absolute left_right_shape">
                    <img src="/assets/images/testimonial_background_shape.jpg" alt="" />
                </figure>
                <figure className="testimonials_top_shape mb-0 position-absolute top_bottom_shape">
                    <img src="/assets/images/testimonial_top_shape.png" alt="" className="img-fluid" />
                </figure>
            </div>
        </section>
    );
};

export default Testimonial;
