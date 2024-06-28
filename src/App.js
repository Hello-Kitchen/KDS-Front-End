import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import OrdersDisplay from './components/OrdersDisplay/OrdersDisplay';

function App() {
  return (
    <div style={{ width: "100%", height: "100%", display: 'flex', flexDirection: "column" }}>
      <Header textLeft="time" textCenter="Cuisine" textRight="date" />
      <div className='w-full h-lb'>
        <OrdersDisplay />
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default App;
