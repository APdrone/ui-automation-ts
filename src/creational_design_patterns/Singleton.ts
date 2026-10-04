class Singelton{
    private static instance:Singelton
    private constructor(){}

    static getInstance(){
        if(!Singelton.instance){
            Singelton.instance=new Singelton()
        }
        return Singelton.instance
    }
    
}