import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import FrontPage from "./pages/FrontPage";
import AuctionsPage from "./pages/AuctionsPage";
import ArtistPage from "./pages/ArtistPage";
import ArtistsPage from "./pages/ArtistsPage";
import BuyerPage from "./pages/BuyerPage";
import CharitiesPage from "./pages/CharitiesPage";
import AboutPage from "./pages/AboutPage";
import Footer from "./components/footer";
import Header from "./components/header";
import "./index.css";

const App = (props) => {
	return (
		<>
			<Router>
				<Header />
				<Route exact path="/" component={FrontPage} />
				<Route path="/auctions" component={AuctionsPage} />
				<Route path="/create" component={ArtistPage} />
				<Route path="/artists" component={ArtistsPage} />
				<Route path="/donate/:Auctionid" component={BuyerPage} />
				<Route path="/charities" component={CharitiesPage} />
				<Route path="/about" component={AboutPage} />
        		<Footer />
			</Router>
		</>
	);
};
export default App;
