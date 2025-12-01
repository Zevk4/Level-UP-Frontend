import React from 'react';
import { Carousel } from 'react-bootstrap';

// 1. Importar nuestro nuevo hook
import useWindowSize from 'hooks/useWindowSize';

// Importar el CSS
import './Reviews.css';

// 2. Definir el breakpoint (Móvil = menos de 768px)
const MOBILE_BREAKPOINT = 992;

const Reviews: React.FC = () => {
  // 3. Obtener el ancho de la ventana
  const { width = 0 } = useWindowSize();
  const isMobile = width < MOBILE_BREAKPOINT;

  // Creamos un array con los datos de las reviews
  const reviews = [
    {
      href: "https://www.youtube.com/watch?v=Hb8DbknQETU",
      className: "review-card review-card-mouse",
      title: "Review Logitech G502 HERO",
      text: "Un mouse gamer con sensor preciso y botones programables."
    },
    {
      href: "https://www.youtube.com/watch?v=jYFVL-9HEaE",
      className: "review-card review-card-pc",
      title: "Asus ROG Strix G10",
      text: "¿Rinde bien para juegos competitivos? Lo probamos."
    },
    {
      href: "https://www.youtube.com/watch?v=TbmXaItIYno",
      className: "review-card review-card-audi",
      title: "Review HyperX Cloud II",
      text: "Pongamos a prueba los Nuevos Auriculares HyperX Cloud II ."
    }
  ];

  return (
    <section id="reviews" className="reviews mb-5">
      <h3><b>Nuevas Review</b></h3>

      {/* 4. LÓGICA CONDICIONAL */}
      {isMobile ? (

        /* --- Versión Móvil: <Carousel> con puntos --- */
        <Carousel variant="dark" interval={null} indicators={true} controls={false}>
          {reviews.map((review) => (
            <Carousel.Item key={review.title}>
              <div className="review-carousel-item-wrapper">
                <a href={review.href} target="_blank" rel="noopener noreferrer" className={review.className}>
                  <h4><b>{review.title}</b></h4>
                  <p>{review.text}</p>
                </a>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

      ) : (

        /* --- Versión Desktop: <div> con scroll --- */
        <div className="reviews-slider">
          {reviews.map((review) => (
            <a key={review.title} href={review.href} target="_blank" rel="noopener noreferrer" className={review.className}>
              <h4><b>{review.title}</b></h4>
              <p>{review.text}</p>
            </a>
          ))}
        </div>

      )}
    </section>
  );
};

export default Reviews;