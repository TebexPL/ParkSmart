import business from '../business/business.container.js';
import appException from "../service/appException.js";
import auth from "../middleware/auth.js"
import mongoose from 'mongoose';

const sectionEndpoint = (router) => {

    router.get('/api/section', async (request, response, next) => {
        try {
            const result = await business.getSectionManager().query()
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.post('/api/section', auth, async (request, response, next) => {
        try {
            const result = await business.getSectionManager().insert(request.body);
            response.status(201).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });
    router.put('/api/section', auth, async (request, response, next) => {
        try {
            const result = await business.getSectionManager().update(request.body);
            response.status(201).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.delete('/api/section', auth, async (request, response, next) => {
        try {
            const result = await business.getSectionManager().remove(request.body);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });
};
export default sectionEndpoint;
