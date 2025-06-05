import { useState, useEffect } from 'react';
import { sliderData } from './SliderData';
import styles from './Slider.module.scss';

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderContent}>
        <h2 className={styles.mainHeading}>Empower Your AI Experience</h2>
        <div className={styles.slide}>
          <h3 className={styles.slideHeading}>{sliderData[currentSlide].heading}</h3>
          <p className={styles.slideText}>{sliderData[currentSlide].content}</p>
        </div>
        <div className={styles.indicators}>
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${currentSlide === index ? styles.active : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider; 