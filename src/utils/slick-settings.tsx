export const sliderSettings = {
  customPaging: function () {
    return (
      <a>
        <div className="slider-bar">
          <div className="item"></div>
        </div>
      </a>
    );
  },
  dots: true,
  dotsClass: 'slick-dots slick-thumb',
  infinite: true,
  speed: 500,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: true,
};
