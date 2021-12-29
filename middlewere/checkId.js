
const mongoose =require('mongoose')

const chackId=async(req,res,next)=>{
    const id = req.params.id //---(طلعنا قيمتها) id الحين نشوف اذا هي اوبجكت id
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(500).send("the path id is a valid id")

    next()
}
module.exports=chackId