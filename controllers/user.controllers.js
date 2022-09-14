
/**¡¡¡¡¡Modelo de las configuraciones generales!!!! */
import Config from "../models/Config.js";

import Category from "../models/Category.js"
import Project from "../models/Project.js";
import Worker from "../models/Worker.js";

import bcrypt from "bcrypt"

const types = ['ADMIN', 'FINANCIERO', 'RECURSOS HUMANOS', ' PROYECTO']



class UserController {

    constructor(){}

    async login (req,res,next){
        const user = await Worker.findOne({name: req.body.user}).populate('category').exec();
        /**
         * si no existe el usario
         * si la contraseña es distinta
         * o no tiene contraseña, se redirige añ login
         */
        
        if(user == null || req.body.pwd != user.pwd || !user.pwd){
            req.session.user.error="Error en el login, revisa tus credenciales"
            res.redirect('/')
            next();
            return
        }
        req.session.user = user;
        if(user.name =='admin'){
            res.redirect('/admin')
            next();
            return
        }
        if(user.name =="rrhh"){

            res.redirect('/rrhh')
            next();
            return
        }
        if(user.name =="financiero"){
            res.redirect('/financiero')
            next();
            return
        }
        /**
         * Se hace un includes temporal hasta definir la categoria de
         * Jefe de Proyecto.
         * ¿Existen variantes o solo es jefe de proyecto?
         * 
         */

        if(user.category.name.includes("Jefe de Proyecto")){
            res.redirect('/projects')
            next();
            return
        }else{
            res.redirect('/')
            next();
            return

        }


    }
    
    async rrhhPage (req,res,next){

        let {dniOrName, categoryName} = req.query

        let workers = await Worker.find({
                                    name:{$ne:"admin"},
                                })
                                .populate('category')
                                .populate('projects');
                                
        if(dniOrName){
            workers = workers.filter( worker =>{
                let {dni, name} = worker;
                return dni.toLowerCase().includes(dniOrName.toLowerCase()) || name.toLowerCase().includes(dniOrName.toLowerCase())
            })
        }        

        let categories = await Category.find({});
        if(categoryName){
            categories = categories.filter( category =>{
                let {name} = category;
                return name.toLowerCase().includes(categoryName.toLowerCase())
            }) 
        }
        const projects = await Project.find({});
        res.render('rrhh',{
            error:req.session.user.error,
            workers:workers,
            categories:categories,
            project:projects
        });
        next();
    }

    async addCategory(req,res,next){
        const {name,cost} = req.body;
        let category = Category.find({
            name:name
        })

        if(category){
            req.session.user.error = "Ya existe esa categoria"
            res.redirect('rrhh')
            return
        }


        category = new Category({
            name:name,
            cost:cost
        });

        try {
            await category.save();
            res.redirect('back');
        } catch (error) {
            res.status(500).send(error);
        }
        next();

    }

    async deleteCategory(req,res,next){
        let {id} = req.params

        try {
            let category = await Category.findByIdAndDelete(id).exec();

            res.redirect('back')

        } catch (error) {
            
        }
    }

    async updateCategory(req,res,next){
        let {id} = req.params
        let {
            name,
            cost
        } = req.body
        try {
            let category = await Category.findByIdAndUpdate(id, {
                name:name,
                cost:cost
            })
            category.save()
            res.redirect('back')
        } catch (error) {
            
        }
        next()
    }


    async addWorker(req,res,next){
        let {
            name,
            dni,
            categoryName,
            projectName,
        } = req.body;
        let worker = await Worker.findOne({dni:dni}).exec();
        if(worker){
            req.session.user.error = "El trabajador ya existe"
            res.redirect('rrhh')
            return;
        }
        req.session.user.error = ""

        let category = await Category.findOne({name:categoryName}).exec()
        let project = await Project.findOne({name:projectName}).exec()
        
        worker = new Worker({
            name:name,
            dni:dni,
            category:category,
        })
        try {
            await worker.save();
            res.redirect('back');


        } catch (error) {
            res.status(500).send(error);
        }
        next();

    }

    async deleteWorker(req,res,next){
        let {dni} = req.params
        try {
            await Worker.findOneAndDelete({dni:dni}).exec();
            res.redirect('back')

        } catch (error) {
            
        }
        next()
    }

    async updateWorker(req,res,next){
        let originalDni = req.params.dni
        let {
            name,
            dni,
            categoryName,
            projectName,
            timeToWork,
            pwd
        } = req.body

        if(pwd){
            worker = await Worker.findOne({dni:originalDni})
            worker.pwd = pwd
            worker.save();
            res.redirect('back')

            return;
        }
        
        if(! Array.isArray(projectName)){
            projectName = [projectName]
        }
        try {

            let category = await Category.findOne({name:categoryName}).exec()
            let projects = await Project.find({name: {
                $in: projectName
            }}).populate('coordinator').populate('workers')
            worker = await Worker.findOneAndUpdate({dni:originalDni},{
                ...req.body,
                category:category,
                projects:projects
            })

            //console.log(projects)

            projects.forEach( async (project) =>{
                if(category.name == "Jefe de Proyecto"){
                    if(!project.coordinator){
                        project.coordinator = worker;
                        project.save()
                        return;
                    }
                    /**Existe cambio de jede de Proyect */
                    if(worker.dni != project.coordinator.dni){
                        let oldCoordinator = project.coordinator;
                        /**le quitamos la coordinacion de un proyecto al coordinador antiguo */
                        oldCoordinator.projects.remove(project);
                        oldCoordinator.save()
                        project.coordinator = worker;
                        project.save()
                        return;
                    }

                }
                if(project.workers.filter(worker => worker.dni == dni || worker.dni == originalDni).length == 0){
                    project.workers.push(worker)
                    project.save()
                    return
                }else{
                    console.log(project)
                    return;
                }


            })

            worker.save()
            res.redirect('back')
        } catch (error) {
            
        }
        next()
    }

    async financialPage(req,res,next){
        let {
            codeOrName
        } = req.query

        let servicePercentaje = await Config.findOne({name:"Servicios Centrales"}).exec()
        let projects = await Project.find().populate("coordinator").exec();
        if(codeOrName){
            projects = projects.filter( project =>{
                let {name,code} = project;
                return name.toLowerCase().includes(codeOrName.toLowerCase()) ||
                        code.toLowerCase().includes(codeOrName.toLowerCase())
            })
        }

        
        let category = await Category.find({name:"Jefe de Proyecto"}).exec()
        let coordinators = await Worker.find({
            category:category
        }).exec();

        res.render('finacial',{
            error: req.session.user.error,
            servicePercentaje,
            projects, 
            coordinators})
        next();
    }

    async projectPage(req,res,next){
        let user = req.session.user;
        let projects = await Project.find({
            $in:  user.projects
        }).populate('workers')
        res.render('projects', {projects,projects})
    }
    
    async addProject(req,res,next){

        let {
            name,
            budget,
            code,
            coordinator,
            startDate,
            endDate
        } = req.body
        let project = await Project.findOne({code:code}).exec();
        if(project){
            req.session.user.error = "Ya existe el Código del Proyecto"
            res.redirect('/financiero')
            return;
        }

        let coord = await Worker.findOne({name:coordinator}).exec()

        project = new Project({
            name:name,
            budget:budget,
            code:code,
            coordinator:coord,
            startDate:startDate,
            endDate:endDate
        })
    
        try {
            await project.save();
            res.redirect('back');
        } catch (error) {
            res.status(500).send(error);
        }
        return;
    }

    async deleteProject(req,res,next){
        let {
            id
        } = req.params

        try {
            await Project.findByIdAndDelete(id).exec();
            res.redirect('back')

        } catch (error) {
            res.status(500).send(error);
        }
        next()

    }

    async updateProject(req,res,next){
        let {
            id
        } = req.params
        let{
            name,
            code,
            budget,
            startDate,
            endDate
        } = req.body
        let coordinatorName = req.body.coordinator
        let coord = await Worker.findOne({name:coordinatorName}).exec()

        try {
            await Project.findByIdAndUpdate(id,{
                name,
                code,
                budget,
                startDate,
                endDate,
                coordinator:coord
            }).exec();
            res.redirect('back')

        } catch (error) {
            res.status(500).send(error);
        }
        return;
    }

    async addCost(req,res,next){
        let {id} = req.params;

        let {
            name,
            cost
        } = req.body
        let project = await Project.findById(id).exec();

        project.costs.push({
            name:name,
            cost:cost
        })

        project.save();
        res.redirect('back')
    }

    async projectDetailsPage(req,res,next){
        let {id} = req.params

        let project = await Project.findById(id).populate('coordinator').populate({
            path:'workers', 
            populate:{
                path:'category'
            }
        }).exec();
        let servicePercentaje = await Config.findOne({name:"Servicios Centrales"}).exec();

        res.render('projectDetails', {project,servicePercentaje})
        return
    }

    async updateConfig(req,res,next){
        let {id} = req.params;
        let {
            value
        } = req.body
        let config = await Config.findByIdAndUpdate(id,{
            value:value
        })
        config.save()
        res.redirect('back')
        return
    }

    async adminPage(req,res,next){
        let workers = await (await Worker.find({}).populate('category')).filter( worker =>{
            let categoryName = worker.category ? worker.category.name : "";
            let workerName = worker.name
            return workerName == 'rrhh' || workerName == 'financiero' || workerName == 'admin'|| categoryName == 'Jefe de Proyecto'

        });
        let configs = await Config.find({})
        res.render('admin',{configs,workers})
        return
    }

    async loginPage(req,res,next){
        if(!req.session.user){
            req.session.user={}
        }
        try {
            res.render('login',{
                error:req.session.user.error
            })
        } catch (error) {
            res.render('login',{error:null})
        }

    }
}


const userController = new UserController()
export default userController;