exports.getUri = () => {
    if(process.env.NODE_ENV === "production"){
        return process.env.MONGO_URL;
    }else{
        return "mongodb://localhost:27017/todos"
    }
};
