import business from '../business/business.container.js';
import appException from "../service/appException.js";
import auth from "../middleware/auth.js"
import mongoose from 'mongoose';

const spaceEndpoint = (router) => {

    router.get('/api/space', async (request, response, next) => {
        try {
            const result = await business.getSpaceManager().query()
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.get('/api/space/:sectionID', async (request, response, next) => {
        try {
            const result = await business.getSpaceManager().queryInSection(request.params);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.post('/api/space', auth, async (request, response, next) => {
        try {
            const result = await business.getSpaceManager().insert(request.body);
            response.status(201).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.put('/api/space/taken', auth, async (request, response, next) => {
        try {
            const result = await business.getSpaceManager().updateTaken(request.body);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });

    router.put('/api/space/name', auth, async (request, response, next) => {
            try {
                const result = await business.getSpaceManager().updateName(request.body);
                response.status(200).send(result);
            } catch (error) {
                appException.errorHandler(error, response);
            }
        });

    router.delete('/api/space', auth, async (request, response, next) => {
        try {
            const result = await business.getSpaceManager().remove(request.body);
            response.status(200).send(result);
        } catch (error) {
            appException.errorHandler(error, response);
        }
    });
};
export default spaceEndpoint;
