import React from 'react';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import OrdersDisplay from './components/OrdersDisplay/OrdersDisplay';

function App() {
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

export default App;
