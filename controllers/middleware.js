import Worker from "../models/Worker.js";


function validateRole(req,res,next) {

    res.redirect('/')
}

function validateHumanResources(req,res,next) {
    let allowUsers = ['rrhh','admin']
    if(!req.session.user || !allowUsers.includes(req.session.user.name)){

        res.redirect('/')
        return
    }

    return next()
}

function validateFinancial(req,res,next) {
    let allowUsers = ['financiero','admin']

    if(!req.session.user || !allowUsers.includes(req.session.user.name)){
        res.redirect("/")
        return
    }
    return next()

}

function validateCoordinator(req,res,next) {
    // if(!req.session.user){
    //     res.redirect('/')
    //     return
    // }
    if(req.session.user.category.name.includes("Jefe de Proyecto") || req.session.user.name != 'admin'){
        return next()

    }
    res.redirect('/')
    return
}

function validateFinancialOrCoordinator(req,res,next) {
    if(!req.session.user ){
        res.redirect('/')
        return;
    }

    if(
        req.session.user.name == 'financiero' || 
        req.session.user.category.name.includes( "Jefe de Proyecto") || 
        req.session.user.name == 'admin')
    {
        return next()

    }
    res.redirect('/')
    return;

}

function validateAdmin(req,res,next) {
    try {
        if( req.session.user !=null ||req.session.user.name != 'admin'){
            return next()
    
        }
        res.redirect('/')
        return;
    } catch (error) {
        res.redirect('/')
        return;
    }


}

function validateUser(req, res, next){
    if (!req.session || !req.session.user)
        return res.redirect("/")
    return next()

}


let middleware ={
    validateCoordinator,
    validateFinancial,
    validateHumanResources,
    validateRole,
    validateUser,
    validateFinancialOrCoordinator,
    validateAdmin
}
export default middleware;

