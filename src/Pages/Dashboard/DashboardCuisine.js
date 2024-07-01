import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import OrdersDisplay from '../../Components/OrdersDisplay/OrdersDisplay';
import './DashboardCuisine.css';

function DashboardCuisine() {
  return (
    <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      <Header textLeft="time" textCenter="Cuisine" textRight="date" />
      <div style={{ width: "100%", height: "85%" }}>
        <OrdersDisplay/>
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default DashboardCuisine;
