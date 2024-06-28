import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import OrdersDisplay from '../../Components/OrdersDisplay/OrdersDisplay';
import LeftSection from "../../Components/LeftSection/LeftSection"
import './Dashboard.css';

function Dashboard() {
  return (
    <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      <Header textLeft="time" textCenter="Cuisine" textRight="date" />
      <div className='w-full h-85% grid grid-cols-[5%_1fr] grid-rows-2 gap-0.5 bg-kitchen-blue'>
        <div class="col-span-1 row-span-2"><LeftSection/></div>
        <div class="col-span-1 row-span-1 bg-white"><OrdersDisplay /></div>
        <div class="col-span-1 row-span-1 bg-white">Placeholder for now</div>
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default Dashboard;
