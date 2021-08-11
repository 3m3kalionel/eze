import controllers from "../controllers";

const requestsController = controllers.request;

const routes = (app) => {
	app.post('/api/v1/populateDatabase', requestsController.saveSheetsDataToCollections);
	app.get('/api/v1/search', requestsController.searchProducts)
};

export default routes;
