import React from 'react';
import { Link } from 'react-router-dom';

import './PopularCategories.css';

const PopularCategories: React.FC = () => {
    return (
        <section id="categorias-populares" className="cat-pop mb-5">
            <h3><b>Categorías populares</b></h3>

            <div className="cat-grid">
                {/* REGLAS DE JSX:
            1. Todas las etiquetas (como <img>) deben cerrarse (ej: <img ... />)
            2. 'alt' es obligatorio para accesibilidad.
        */}
                <Link className="cat-card cat--blue" to="/category?cat=Computacion#productos">
                    <div className="cat-info">
                        <h4>PC Gamer</h4>
                        <p>Corre tus juegos al máximo rendimiento</p>
                        <span className="cat-cta">Ver ofertas →</span>
                    </div>
                    <div className="cat-art">
                        {/* NOTA: Asegúrate que esta imagen esté en 'public/assets/img/publicidad/pc.png' */}
                        <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654005/pc_ouuyy1.png" alt="PC Gamer ASUS ROG Strix" />
                    </div>
                </Link>

                <Link className="cat-card cat--blue" to="/category?cat=Consolas&sub=PlayStation#productos">
                    <div className="cat-info">
                        <h4>PlayStation</h4>
                        <p>Lo más reciente de Sony</p>
                        <span className="cat-cta">Ver ofertas →</span>
                    </div>
                    <div className="cat-art">
                        <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654005/Ps5pro_zrpafx.webp" alt="PlayStation 5" />
                    </div>
                </Link>

                <Link className="cat-card cat--green" to="/category?cat=Perifericos&sub=Mouse%20Gamer#productos">
                    <div className="cat-info">
                        <h4>Mouse gamer</h4>
                        <p>Precisión y velocidad para competir</p>
                        <span className="cat-cta">Ver ofertas →</span>
                    </div>
                    <div className="cat-art">
                        <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654005/g502_seajnv.png" alt="Mouse Logitech G502 HERO" />
                    </div>
                </Link>

                <Link className="cat-card cat--blue" to="/category?cat=Sillas%20Gamer#productos">
                    <div className="cat-info">
                        <h4>Sillas Gamer</h4>
                        <p>La mayor Comodidad</p>
                        <span className="cat-cta">Ver ofertas →</span>
                    </div>
                    <div className="cat-art">
                        <img src="https://res.cloudinary.com/dinov1bgq/image/upload/v1762654004/sillagamer_mtpgxl.webp" alt="Silla Gamer Secretlab" />
                    </div>
                </Link>
            </div>
        </section>
    );
};

export default PopularCategories;