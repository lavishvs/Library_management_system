export const calculateFine = (dueDate)=>{
    const finePerHour = 0.1; //10 cent
    const today = new Date();
    if(today > dueDate){
        const diff = today - dueDate;
        const latehours = Math.ceil(diff / (1000 * 60 * 60));
        const fine = latehours * finePerHour;
        return fine;
    }
    return 0;
}