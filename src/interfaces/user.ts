
// definimos las preferencias 
export interface Preference {
    language?: number;
    // 0 ---> ESPAÑOL
    // 1 ---> INGLES
}

// definimos al usuario
export interface User{
    uid:string;
    coins?:number;
    email:string;
    roles?:number;// 0 ----> ES UN ADMIN // 1 ----> ES UN USUARIO
    preference?:Preference;
    username?:string;
    picture?:string;
}
