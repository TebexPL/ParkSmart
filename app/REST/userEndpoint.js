import business from '../business/business.container.js';
import appException from "../service/appException.js";
import auth from "../middleware/auth.js";
import mongoose from 'mongoose';

const userEndpoint = (router) => {


    router.post('/api/user', async (request, response, next) => {
        try {
            const result = await business.getUserManager().auth(request.body);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });
    router.delete('/api/user',auth, async (request, response, next) => {
        try {
            const data = {};
            data.token = request.headers["authorization"];
            const result = await business.getUserManager().logout(data);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

};
export default userEndpoint;
