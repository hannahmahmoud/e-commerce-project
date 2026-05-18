import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="home__">

        <div className="homeleft">
          <p className="homebrand">CloudKitchen</p>
          <h1 className="hometitle">
            Commercial Kitchens Built For Delivery
          </h1>
          <p className="homedesc">
            Our kitchens are intended for speed, quality, and scale -
            making it simple to launch a delivery restaurant with
            generally safe and low capital.
          </p>
          <button className="homebtn" onClick={() => navigate('/products')}>
            Shop Now
          </button>
        </div>

        <div className="homeright">
          <div className="homeimg-frame">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
              alt="Food"
              className="home-img"
            />
          </div>
        </div>

      </section>
    </div>
  );
}
