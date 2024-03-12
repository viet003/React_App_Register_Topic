import React from "react";
import Slider from "react-slick";
import slick1 from "../assets/slick1.png";
import slick2 from "../assets/slick2.png";
import slick3 from "../assets/slick3.jpg";

const SlickComponent = () => {
    var lisSlick = [slick1, slick2, slick3];

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    return (
        <div className="w-full z-0 overflow-hidden">
            <Slider {...settings}>
                {lisSlick.map((e, index) => (
                    <div key={index} className="flex items-center justify-center rounded-xl overflow-hidden">
                        <img className="h-[50%] max-h-[70%] object-cover max-w-[100%]" src={e} alt={`slick-${index}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default SlickComponent;
