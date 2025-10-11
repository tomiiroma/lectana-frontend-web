import api from "./client";


export async function logout(){
    try{
        const { data } = await api.post('/auth/logout');
    console.log('Respuesta', data);
    }catch(error){
        console.log(error)
    }
}