

export const globalError = (err, req, res, next) => {
    let code = err.statusCode || 500 
    res.status(code).json({message: 'error' , code, err: err.message, stack: err.stack })
}