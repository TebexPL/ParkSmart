import business from '../business/business.container.js';
import appException from "../service/appException.js";
import auth from "../middleware/auth.js"
import mongoose from 'mongoose';

const historyEndpoint = (router) => {

    router.get('/api/history', auth, async (request, response, next) => {
        try {
            const result = await business.getHistoryManager().query();
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.post('/api/history', async (request, response, next) => {
        try {
            const result = await business.getHistoryManager().insert(request.body);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });
    router.delete('/api/history', async (request, response, next) => {
        try {
            const result = await business.getHistoryManager().clear();
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });



};
export default historyEndpoint;
