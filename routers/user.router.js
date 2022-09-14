import {Router} from "express";

import middleware from "../controllers/middleware.js";
import userControllers from "../controllers/user.controllers.js";

const router = Router();


router.get('/', userControllers.loginPage)
router.post('/login', userControllers.login)

// router.use(middleware.validateUser());
router.get('/rrhh',middleware.validateHumanResources,  userControllers.rrhhPage)
router.post('/category',middleware.validateHumanResources,  userControllers.addCategory)
router.delete('/category/:id',middleware.validateHumanResources,  userControllers.deleteCategory)
router.post('/category/:id',middleware.validateHumanResources,  userControllers.updateCategory)

router.post('/workers',middleware.validateHumanResources,  userControllers.addWorker)
router.delete('/workers/:dni',middleware.validateHumanResources,  userControllers.deleteWorker)
router.post('/workers/:dni',middleware.validateHumanResources,  userControllers.updateWorker)


router.get('/financiero',middleware.validateFinancial,  userControllers.financialPage)

router.get('/projects',middleware.validateCoordinator,  userControllers.projectPage)
router.post('/projects',middleware.validateFinancial,  userControllers.addProject)
router.delete('/projects/:id',middleware.validateFinancial,  userControllers.deleteProject)
router.post('/projects/:id',middleware.validateFinancial,  userControllers.updateProject)

router.post('/projects/:id/costs',middleware.validateFinancial,  userControllers.addCost)

router.get('/projects/:id',middleware.validateFinancialOrCoordinator,  userControllers.projectDetailsPage)

router.get('/admin',middleware.validateAdmin,  userControllers.adminPage)

router.post('/config/:id',middleware.validateFinancialOrCoordinator,  userControllers.updateConfig)
const userRouter = router

export default userRouter;